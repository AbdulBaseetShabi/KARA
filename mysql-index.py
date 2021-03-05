import enum
from flask import Flask, json
from flask import jsonify
from flask import request
import mysql.connector

app = Flask(__name__)

mysql_db = mysql.connector.connect(
  host="localhost",
  user="root",
  password=""
)

cursor = mysql_db.cursor()

DEFAULT_SIZE = 255

#### DB Routes

@app.route('/db/create', methods=['POST'])
def create_db():
    db_name = request.json['db_name']

    if check_db(db_name):
        return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' already exists!'})
    
    create_sql = "CREATE DATABASE " + "`" + db_name + "`" + ";"

    print(create_sql)

    cursor.execute(create_sql)

    if check_db(db_name):
        return jsonify({'status': 200, 'response': 'Database named ' + db_name + ' successfully created!'})
    else:
        return jsonify({'status': 400, 'response': 'Unable to create database named ' + db_name + '!'})    

@app.route('/db/delete', methods=['DELETE'])
def delete_db():
    db_name = request.json['db_name']

    if check_db(db_name):
        drop_sql = "DROP DATABASE " + "`" + db_name + "`" + ";"

        cursor.execute(drop_sql)

        if not check_db(db_name):
            return jsonify({'status': 200, 'response': 'Database named ' + db_name + ' successfully deleted!'})
        else:
            return jsonify({'status': 400, 'response': 'Unable to delete database named ' + db_name + '!'})
    else:
        return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'})


#### Table Routes

@app.route('/table/create', methods=['POST'])
def create_table():
    db_name = request.json['db_name']
    table_name = request.json['table_name']
    columns = request.json['columns']

    if check_db(db_name):
        if check_table(db_name, table_name):
            return jsonify({'status': 400, 'response': 'Table named ' + table_name + ' already exists!'})

        create_sql = "CREATE TABLE " + "`" + table_name + "` ("

        for index, column in enumerate(columns):
            if column['type'] == "VARCHAR":
                create_sql += column['name'] + " " + column['type'] + "(" + column['size'] + ")"
            else:
                create_sql += column['name'] + " " +column['type']

            if index != len(columns) - 1:
                create_sql += ", "

        create_sql += ");"

        use_db = "USE " + "`" + db_name + "`"

        print(create_sql)

        cursor.execute(use_db)

        cursor.execute(create_sql)

        if check_table(db_name, table_name):
            return jsonify({'status': 200, 'response': 'Successfully created table named ' + table_name + ' in the database named ' + db_name})
        else:
            return jsonify({'status': 400, 'response': 'Unable to create table named ' + table_name + '!'})
    else:
        return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'})

@app.route('/table/delete', methods=['DELETE'])
def delete_table():
    db_name = request.json['db_name']
    table_name = request.json['table_name']

    if check_db(db_name):
        if check_table(db_name, table_name):
            drop_sql = "DROP TABLE " + "`" + table_name + "`;"

            use_db = "USE " + "`" + db_name + "`"

            print(drop_sql)

            cursor.execute(use_db)

            cursor.execute(drop_sql)

            if not check_table(db_name, table_name):
                return jsonify({'status': 200, 'response': 'Successfully deleted table named ' + table_name + ' in the database named ' + db_name})
            else:
                return jsonify({'status': 400, 'response': 'Unable to delete table named ' + table_name + '!'})
        else:
            return jsonify({'status': 400, 'response': 'Table named ' + table_name + ' does not exist in the database named ' + db_name + '!'})
    else:
        return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'})

@app.route('/table/add', methods=['POST'])
def add_row():
    db_name = request.json['db_name']
    table_name = request.json['table_name']
    columns = request.json['columns']
    values = request.json['values']

    if check_db(db_name):
        if check_table(db_name, table_name):
            use_db = "USE " + "`" + db_name + "`"
            cursor.execute(use_db)

            add_sql = "INSERT INTO " + "`" + table_name + "` ("

            for (index, column) in enumerate(columns):
                if index != len(columns) - 1:
                    add_sql += column + ","
                else:
                    add_sql += column

            add_sql += ") VALUES ("

            for (index, column) in enumerate(columns):
                if index != len(columns) - 1:
                    add_sql += "%s, "
                else:
                    add_sql += "%s"

            add_sql += ");"

            print(add_sql)

            cursor.execute(add_sql, values)

            mysql_db.commit()

            return jsonify({'status': 200, 'response': 'Record with ID ' + str(cursor.lastrowid) + ' added to table named ' + table_name + ' in the database named ' + db_name})
        else:
            return jsonify({'status': 400, 'response': 'Table named ' + table_name + ' does not exist in the database named ' + db_name + '!'})
    else:
       return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'}) 

@app.route('/table/remove', methods=['DELETE'])
def delete_row():
    db_name = request.json['db_name']
    table_name = request.json['table_name']
    queries = request.json['queries']

    if check_db(db_name):
        if check_table(db_name, table_name):
            use_db = "USE " + "`" + db_name + "`"
            cursor.execute(use_db)

            delete_sql = "DELETE FROM " + "`" + table_name + "`" + " WHERE "

            for (index, query) in enumerate(queries):
                if index != len(queries) - 1:
                    delete_sql += query['column'] + " " + query['relation'] + " '" + query['value'] + "' AND "
                else:
                    delete_sql += query['column'] + " " + query['relation'] + " '" + query['value'] + "'"

            delete_sql += ";"

            print(delete_sql)

            cursor.execute(delete_sql)
            
            mysql_db.commit()

            return jsonify({'status': 200, 'response': str(cursor.rowcount) + ' row(s) deleted from table named ' + table_name + ' in the database named ' + db_name})
        else:
            return jsonify({'status': 400, 'response': 'Table named ' + table_name + ' does not exist in the database named ' + db_name + '!'})
    else:
       return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'}) 

@app.route('/table/find', methods=['GET'])
def find_row():
    db_name = request.json['db_name']
    table_name = request.json['table_name']
    columns = request.json['columns'] if len(request.json['columns']) > 0 else None
    queries = request.json['queries'] if len(request.json['queries']) > 0 else None

    if check_db(db_name):
        if check_table(db_name, table_name):
            use_db = "USE " + "`" + db_name + "`"
            cursor.execute(use_db)

            select_sql = "SELECT "

            if columns != None:
                for (index, column) in enumerate(columns):
                    if index != len(columns) - 1:
                        select_sql += column + ", "
                    else:
                        select_sql += column + " "
            else:
                select_sql += "* "

            select_sql += "FROM " + "`" + table_name + "`"

            if queries != None:
                select_sql += " WHERE "
                for (index, query) in enumerate(queries):
                    if index != len(queries) -1:
                        select_sql += query['column'] + " " + query['relation'] + " '" + query['value'] + "' AND "
                    else:
                        select_sql += query['column'] + " " + query['relation'] + " '" + query['value'] + "';"
            else:
                select_sql += ";"

            print(select_sql)

            cursor.execute(select_sql)

            row_headers = [x[0] for x in cursor.description]

            rows = cursor.fetchall()

            result = []

            for row in rows:
                result.append(dict(zip(row_headers, row)))

            return jsonify({'status': 200, 'response': result})
        else:
            return jsonify({'status': 400, 'response': 'Table named ' + table_name + ' does not exist in the database named ' + db_name + '!'})
    else:
       return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'})    

#### Helper Functions

def check_db(db_name):
    cursor.execute("SHOW DATABASES")

    for (db,) in cursor:
        if db == db_name:
            return True
    
    return False

def check_table(db_name, table_name):
    use_db = "USE " + "`" + db_name + "`;"

    cursor.execute(use_db)

    cursor.execute("SHOW TABLES")

    for (table, ) in cursor:
        if table == table_name:
            return True

    return False

if __name__ == '__main__':
    app.run(debug=True)