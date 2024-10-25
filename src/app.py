from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Database connection
db = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = "SUSh@123456",
    database = "world"
)

cursor = db.cursor()

# Create table (run this once)
def create_table():
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        first_name VARCHAR(50),
                        last_name VARCHAR(50),
                        phone_number VARCHAR(15),
                        email VARCHAR(100),
                        address VARCHAR(255)
                      )''')

create_table()

# Endpoint to get all users
@app.route('/users', methods=['GET'])
def get_users():
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    return jsonify(users)

# Endpoint to add a user
@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    sql = "INSERT INTO users (first_name, last_name, phone_number, email, address) VALUES (%s, %s, %s, %s, %s)"
    val = (data['first_name'], data['last_name'], data['phone_number'], data['email'], data['address'])
    cursor.execute(sql, val)
    db.commit()
    return jsonify({"message": "User added successfully"}), 201

# Endpoint to delete a user
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    sql = "DELETE FROM users WHERE id=%s"
    cursor.execute(sql, (user_id,))
    db.commit()
    return jsonify({"message": "User deleted successfully"})

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    sql = "UPDATE users SET first_name=%s, last_name=%s, phone_number=%s, email=%s, address=%s WHERE id=%s"
    val = (data['first_name'], data['last_name'], data['phone_number'], data['email'], data['address'], user_id)
    cursor.execute(sql, val)
    db.commit()
    return jsonify({"message": "User updated successfully"})

if __name__ == "__main__":
    app.run(debug=True)
