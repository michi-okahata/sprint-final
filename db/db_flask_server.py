import sqlite3
from flask import Flask, request, json, jsonify

from encryption_functions import encode_new_password, decode_vault_password, validate_master_password
from gen_master_password_profile_script import setup_user_master_pass

import logging
logging.basicConfig(filename="full_errors.log", level=logging.ERROR, format="%(message)s")

app = Flask(__name__)

DB_NAME = "pswdDB.sqlite"

# Helper function to connect to the SQLite database
def connect_db():
    try:
        conn = sqlite3.connect(DB_NAME)
        cur = conn.cursor()
        return conn, cur
    except sqlite3.Error as e:
        return None, None

# Helper function to create passwords table
def create_passwords_table(conn):
    create_table_query = """
    CREATE TABLE IF NOT EXISTS passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        url TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """
    try:
        cur = conn.cursor()
        cur.execute(create_table_query)
        conn.commit()
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        cur.close()


# Helper function to create master password table
def create_master_password_table(conn):
    master_query = """
    CREATE TABLE IF NOT EXISTS master_password (
        username TEXT NOT NULL,
        hashed_mp TEXT NOT NULL
    );
    """
    try:
        cur = conn.cursor()
        cur.execute(master_query)
        conn.commit()
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        cur.close()

# Test
@app.route('/api/test', methods=['GET'])
def test_get():
  return jsonify({"username": "name", "password": "pass"})

# Initialize tables API
@app.route('/init_db', methods=['POST'])
def init_db():
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        create_master_password_table(conn)
        create_passwords_table(conn)
        return jsonify({"message": "Tables initialized successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Error initializing tables: {e}"}), 500
    finally:
        conn.close()
        
# Store the master password. Fixed. Works once.
@app.route('/add_master_password', methods=['POST'])
def add_master_password():
    data = request.get_json()
    master_pass = data.get("master_pass")
    user = data.get("username")
    hashed_mp, username = setup_user_master_pass(master_pass, user)
    insert_query = """
    INSERT INTO master_password (username, hashed_mp)
    VALUES (?, ?);
    """

    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(insert_query, (username, hashed_mp))
        conn.commit()
        # return get_master_password()
        return jsonify({"message": "Master password stored successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Error adding master password: {e}"}), 500
    finally:
        cur.close()
        conn.close()

# Validate login
@app.route('/validate_login', methods=['POST'])
def validate_login():
    input_data = request.get_json()
    input_master_pass = input_data.get("master_pass")
    input_username = input_data.get("username")
    valid_data = get_master_password_()
    valid_master_pass = valid_data.get("hashed_mp")
    valid_username = valid_data.get("username")

    valid = validate_master_password(input_username, input_master_pass, valid_username, valid_master_pass)
    # valid = validate_master_password('testUserFront', 'password123A!Front', 'testUserFront', '$2b$12$LJSfoIUM8/0FiuujxPeYyeEUPhlrgqI0D0v2JUjkPjH7jsKkdKcMi')

    return jsonify({"login": valid})

# Retrieve the master password.
@app.route('/get_master_password', methods=['GET'])
def get_master_password():
    retrieve_query = """
    SELECT username, hashed_mp
    FROM master_password;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(retrieve_query)
        result = cur.fetchone()
        if result:
            '''
            print("RESULT DEBUG\n")
            username, password = result
            print(username)
            print(type(username))
            print(password)
            print(type(password))

            print("leaving original function")
            '''
            username, hashed_mp = result # username == bytestream // hashed_mp == 200
            return jsonify({"username": username, "hashed_mp": hashed_mp}), 200
            # return username, hashed_mp
        else:
            return jsonify({"error": "no profile"})
    except Exception as e:
        # print(f"Error retrieving master password: {e}")
        return jsonify({"error": "no profile"})
    finally:
        cur.close()
        conn.close()

def get_master_password_():
    retrieve_query = """
    SELECT username, hashed_mp
    FROM master_password;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(retrieve_query)
        result = cur.fetchone()
        if result:
            username, hashed_mp = result # username == bytestream // hashed_mp == 200
            return {"username": username, "hashed_mp": hashed_mp}
            # return username, hashed_mp
        else:
            return None, None
    except Exception as e:
        # print(f"Error retrieving master password: {e}")
        return None, None
    finally:
        cur.close()
        conn.close()


# Add a new password entry
@app.route('/add_password', methods=['POST'])
def add_password_entry():
    data = request.json
    username = data.get('username')
    url = data.get('url')
    plaintext_password = data.get('password')

    response, status = get_master_password()
    
    response_data = response.get_json()  # Get JSON data
    username_master = response_data.get('username')
    hashed_mp = response_data.get('hashed_mp')

    encrypted_password = encode_new_password(plaintext_password, username_master, hashed_mp)

    check_query = """
    SELECT COUNT(*) FROM passwords WHERE url = ?;
    """
    insert_query = """
    INSERT INTO passwords (username, url, password)
    VALUES (?, ?, ?);
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        # Check if the URL already exists
        cur.execute(check_query, (url,))
        count = cur.fetchone()[0]
        if count > 0:
            return jsonify({"error": "A password entry for this URL already exists."}), 400

        # Insert the new password entry
        cur.execute(insert_query, (username, url, encrypted_password))
        conn.commit()
        return jsonify({"message": "Password entry added successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Error adding password entry: {e}"}), 500
    finally:
        cur.close()
        conn.close()


# Retrieve a password by URL
@app.route('/get_password', methods=['GET'])
def get_password():
    url = request.args.get('url')
    query = """
    SELECT username, password FROM passwords
    WHERE url = ?;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(query, (url,))
        result = cur.fetchone()
        if result:
            username, encrypted_pswd = result
            
            response, status = get_master_password()

            response_data = response.get_json()  # Get JSON data
            username_master = response_data.get('username')
            hashed_mp = response_data.get('hashed_mp')

            decrypted_pswd = decode_vault_password(encrypted_pswd, username_master, hashed_mp)
            return jsonify({"username": username, "password": decrypted_pswd}), 200
        else:
            return jsonify({"error": "Password not found for the given URL"}), 404
    except Exception as e:
        return jsonify({"error": f"Error retrieving password: {e}"}), 500
    finally:
        cur.close()
        conn.close()


# Delete a password entry by username and URL
@app.route('/delete_password', methods=['DELETE'])
def delete_password():
    data = request.json
    username = data.get('username')
    url = data.get('url')

    query = """
    DELETE FROM passwords
    WHERE username = ? AND url = ?;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(query, (username, url))
        conn.commit()
        return jsonify({"message": "Password entry deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"Error deleting password entry: {e}"}), 500
    finally:
        cur.close()
        conn.close()


# Display all passwords
@app.route('/display_all_passwords', methods=['GET'])
def display_all_passwords():
    query = """
    SELECT username, password FROM passwords;
    """
    conn, cur = connect_db()
    if conn is None or cur is None:
        return jsonify({"error": "Failed to connect to the database"}), 500

    try:
        cur.execute(query)
        results = cur.fetchall()
        if results:
            passwords = []
            response, status = get_master_password()

            response_data = response.get_json()  # Get JSON data
            username_master = response_data.get('username')
            hashed_mp = response_data.get('hashed_mp')

            for username, encrypted_pswd in results:
                decrypted_pswd = decode_vault_password(encrypted_pswd, username_master, hashed_mp)
                passwords.append((username, decrypted_pswd))
            return jsonify({"passwords": passwords}), 200
        else:
            return jsonify({"message": "No passwords found in the database."}), 404
    except Exception as e:
        return jsonify({"error": f"Error retrieving passwords: {e}"}), 500
    finally:
        cur.close()
        conn.close()


# Find and return repeated passwords
# connection to database?
@app.route('/get_repeated_passwords', methods=['GET'])
def get_repeated_passwords():
    try:
        allPasswords = display_all_passwords().get_json()['passwords']
        password_counts = {}
        repeated_passwords = []
        for passwordTuple in allPasswords:
            if passwordTuple[1] in password_counts:
                password_counts[passwordTuple[1]] += 1
            else:
                password_counts[passwordTuple[1]] = 1

        # Filter out the repeated passwords
        for password, count in password_counts.items():
            if count > 1:
                repeated_passwords.append(password)

        return jsonify({"repeated_passwords": repeated_passwords}), 200

    except Exception as e:
        return jsonify({"error": f"Error finding repeated passwords: {e}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
    app.run(port=5000)