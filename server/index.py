from flask import Flask, jsonify, request
from flask_cors import CORS
from connector import Connector
import json

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})

DEFAULT_SIZE = 255

#### Helper Function/Routes
@app.route('/', methods=["GET"])
def running_server():
    return jsonify({'status': 200, 'response': 'Server is running ...'})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

def User_Auth(user_auth, autocommit = False):
    return Connector(driver=user_auth['driver'],server=user_auth['server'], uid=user_auth['user_id'], password=user_auth['password'], autocommit=autocommit)

#### Server Routes
@app.route("/login", methods=["POST"])
def login():
    try:
        user_auth = request.get_json()["user_credential"]
        connector = User_Auth(user_auth)
    except Exception as e:
        return jsonify({'status': 400, 'response': str(e)})
    return jsonify({'status': 200, 'response': 'Valid Credentials'})

#### DB Routes
@app.route('/db/info', methods=['POST'])
def get_dbs():
    try:
        user_auth = request.get_json()["user_credential"]
        connector = User_Auth(user_auth)

        get_query = "SELECT DISTINCT db_name = DB_NAME(database_id), size = CONVERT(varchar, CAST(((SUM(Size)* 8) / 1024.0) AS DECIMAL(18,2)))"\
                    + " FROM  sys.master_files"\
                    + " WHERE database_id > 4"\
                    + " GROUP BY GROUPING SETS ((DB_NAME(database_id)), (DB_NAME(database_id)))"\
                    + " ORDER BY DB_NAME(database_id)"

        connector.execute(get_query)

        row_headers = [x[0] for x in connector.description()]

        rows = connector.fetchall()
        
        result = []

        for row in rows:
            result.append(dict(zip(row_headers, row)))

        return jsonify({'status': 200, 'response': result})

    except Exception as e:
        return jsonify({'status': 400, 'response': str(e)})

@app.route('/db/create', methods=['POST'])
def create_db():
    try:
        user_auth = request.get_json()["user_credential"]
        connector = User_Auth(user_auth, True)

        db_name = request.get_json()['db_name']

        if connector.check_db(db_name):
            return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' already exists!'})
        
        create_sql = "CREATE DATABASE " + "[" + db_name + "]" + ";"

        connector.execute(create_sql)

        if connector.check_db(db_name):
            return jsonify({'status': 200, 'response': 'Database named ' + db_name + ' successfully created!'})
        else:
            return jsonify({'status': 400, 'response': 'Unable to create database named ' + db_name + '!'})    
    except Exception as e:
        return jsonify({'status': 400, 'response': str(e)})

@app.route('/db/delete', methods=['POST'])
def delete_db():
    try:
        user_auth = request.get_json()["user_credential"]
        connector = User_Auth(user_auth, True)

        db_name = request.get_json()['db_name']

        if connector.check_db(db_name):
            drop_sql = "DROP DATABASE " + "[" + db_name + "]" + ";"

            connector.execute(drop_sql)

            if not connector.check_db(db_name):
                return jsonify({'status': 200, 'response': 'Database named ' + db_name + ' successfully deleted!'})
            else:
                return jsonify({'status': 400, 'response': 'Unable to delete database named ' + db_name + '!'})
        else:
            return jsonify({'status': 404, 'response': 'Database named ' + db_name + ' does not exist!'})
    except Exception as e:
        return jsonify({'status': 400, 'response': str(e)})

@app.route('/db/rename', methods=['POST'])
def rename_db():
    try:
        user_auth = request.get_json()["user_credential"]
        connector = User_Auth(user_auth, True)

        original_db_name = request.get_json()['db_name']['previous_name']
        new_db_name = request.get_json()['db_name']['current_name']

        if connector.check_db(original_db_name):
            if not connector.check_db(new_db_name):
                rename_sql = "ALTER DATABASE " + "[" + original_db_name + "]" + " MODIFY NAME = " + "[" + new_db_name + "]"

                connector.execute(rename_sql)

                if connector.check_db(new_db_name):
                    return jsonify({'status': 200, 'response': 'Database ' + original_db_name + ' successfully renamed to ' + new_db_name + '!'})
                else:
                    return jsonify({'status': 400, 'response': 'Unable to rename database named ' + original_db_name + '!'})
            else:
                return jsonify({'status': 400, 'response': 'A database in your server already has the name ' + new_db_name})                
        else:
            return jsonify({'status': 400, 'response': 'Database named ' + original_db_name + ' does not exist!'})
    except Exception as e:
        return jsonify({'status': 400, 'response': str(e)})

#### Table Routes
@app.route('/table/info', methods=['POST'])
def get_tables():
    try:
        user_auth = request.get_json()["user_credential"]
        connector = User_Auth(user_auth)

        db_name = request.get_json()['db_name']

        if connector.check_db(db_name):
            get_query = "SELECT name as table_name, create_date, modify_date"\
                + f" FROM [" + db_name + "].sys.tables"

            connector.execute(get_query)

            row_headers = [x[0] for x in connector.description()]

            rows = connector.fetchall()

            result = []

            for row in rows:
                result.append(dict(zip(row_headers, row)))

            return jsonify({'status': 200, 'response': result})
        else:
            return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'})
    except Exception as e:
        return jsonify({'status': 400, 'response': str(e)})

@app.route('/table/rename', methods=['POST'])
def rename_table():
    try:
        user_auth = request.get_json()["user_credential"]
        connector = User_Auth(user_auth)

        db_name = request.get_json()["db_name"]
        original_table_name = request.get_json()['table_name']['from']
        new_table_name = request.get_json()['table_name']['to']

        if connector.check_db(db_name) and connector.check_table(db_name, original_table_name):
            if not connector.check_table(db_name, new_table_name):
                use_db_sql = "USE "  + db_name 
                connector.execute(use_db_sql)

                rename_sql = "EXEC sp_rename " + "'[dbo].[" + original_table_name + "]', '" + new_table_name + "'";
                
                connector.execute(rename_sql)

                if connector.check_table(db_name, new_table_name):
                    return jsonify({'status': 200, 'response': 'Table named ' + original_table_name + ' in database ' + db_name + ' has successfully been renamed to ' + new_table_name + '!'})
                else:
                    return jsonify({'status': 400, 'response': 'Unable to rename the table named ' + original_table_name + ' in database ' + db_name})
            else:
                return jsonify({'status': 400, 'response': 'The database ' + db_name + ' in your server already has the name ' + new_table_name})                
        else:
            return jsonify({'status': 400, 'response': 'Table in [' + db_name + '].' + original_table_name + ' does not exist!'})
    except Exception as e:
        return jsonify({'status': 400, 'response': str(e)})

@app.route('/table/create', methods=['POST'])
def create_table():
    connector = Connector()

    db_name = request.json['db_name']
    table_name = request.json['table_name']
    columns = request.json['columns']

    if connector.check_db(db_name):
        if connector.check_table(db_name, table_name):
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

        connector.execute(use_db)

        connector.execute(create_sql)

        if connector.check_table(db_name, table_name):
            return jsonify({'status': 200, 'response': 'Successfully created table named ' + table_name + ' in the database named ' + db_name})
        else:
            return jsonify({'status': 400, 'response': 'Unable to create table named ' + table_name + '!'})
    else:
        return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'})

@app.route('/table/delete', methods=['POST'])
def delete_table():
    try:
        user_auth = request.get_json()["user_credential"]
        connector = User_Auth(user_auth, True)

        db_name = request.get_json()['db_name']
        table_name = request.get_json()['table_name']

        if connector.check_db(db_name):
            if connector.check_table(db_name, table_name):
                drop_sql = "DROP TABLE [" + db_name + "].[dbo]." + "[" + table_name + "];"

                connector.execute(drop_sql)

                if not connector.check_table(db_name, table_name):
                    return jsonify({'status': 200, 'response': 'Successfully deleted table named ' + table_name + ' in the database named ' + db_name})
                else:
                    return jsonify({'status': 400, 'response': 'Unable to delete table named ' + table_name + '!'})
            else:
                return jsonify({'status': 404, 'response': 'Table named ' + table_name + ' does not exist in the database named ' + db_name + '!'})
        else:
            return jsonify({'status': 404, 'response': 'Database named ' + db_name + ' does not exist!'})
    except Exception as e:
        return jsonify({'status': 400, 'response': str(e)})

@app.route('/table/add', methods=['POST'])
def add_row():
    connector = Connector()

    db_name = request.json['db_name']
    table_name = request.json['table_name']
    columns = request.json['columns']
    values = request.json['values']

    if connector.check_db(db_name):
        if connector.check_table(db_name, table_name):
            use_db = "USE " + "`" + db_name + "`"
            connector.execute(use_db)

            add_sql = "INSERT INTO " + "`" + table_name + "` ("

            for (index, column) in enumerate(columns):
                if index != len(columns) - 1:
                    add_sql += column + ","
                else:
                    add_sql += column

            add_sql += ") VALUES ("

            for (index, column) in enumerate(columns):
                if index != len(columns) - 1:
                    add_sql += "?, "
                else:
                    add_sql += "?"

            add_sql += ");"

            connector.execute(add_sql, values)

            connector.commit()

            return jsonify({'status': 200, 'response': 'Record with ID ' + str(connector.lastrowid()) + ' added to table named ' + table_name + ' in the database named ' + db_name})
        else:
            return jsonify({'status': 400, 'response': 'Table named ' + table_name + ' does not exist in the database named ' + db_name + '!'})
    else:
       return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'}) 

@app.route('/table/remove', methods=['DELETE'])
def delete_row():
    connector = Connector()

    db_name = request.json['db_name']
    table_name = request.json['table_name']
    queries = request.json['queries']

    if connector.check_db(db_name):
        if connector.check_table(db_name, table_name):
            use_db = "USE " + "`" + db_name + "`"
            connector.execute(use_db)

            delete_sql = "DELETE FROM " + "`" + table_name + "`" + " WHERE "

            for (index, query) in enumerate(queries):
                if index != len(queries) - 1:
                    delete_sql += query['column'] + " " + query['relation'] + " '" + query['value'] + "' AND "
                else:
                    delete_sql += query['column'] + " " + query['relation'] + " '" + query['value'] + "'"

            delete_sql += ";"

            connector.execute(delete_sql)
            
            connector.commit()

            return jsonify({'status': 200, 'response': str(connector.rowcount()) + ' row(s) deleted from table named ' + table_name + ' in the database named ' + db_name})
        else:
            return jsonify({'status': 400, 'response': 'Table named ' + table_name + ' does not exist in the database named ' + db_name + '!'})
    else:
       return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'}) 

@app.route('/table/find', methods=['GET'])
def find_row():
    connector = Connector()

    db_name = request.json['db_name']
    table_name = request.json['table_name']
    columns = request.json['columns'] if len(request.json['columns']) > 0 else None
    queries = request.json['queries'] if len(request.json['queries']) > 0 else None

    if connector.check_db(db_name):
        if connector.check_table(db_name, table_name):
            use_db = "USE " + "`" + db_name + "`"
            connector.execute(use_db)

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

            connector.execute(select_sql)

            row_headers = [x[0] for x in connector.description()]

            rows = connector.fetchall()

            result = []

            for row in rows:
                result.append(dict(zip(row_headers, row)))

            return jsonify({'status': 200, 'response': result})
        else:
            return jsonify({'status': 400, 'response': 'Table named ' + table_name + ' does not exist in the database named ' + db_name + '!'})
    else:
       return jsonify({'status': 400, 'response': 'Database named ' + db_name + ' does not exist!'})    

@app.route('/table/entries', methods=['POST'])
def get_table_entries():
    try:
        user_auth = request.get_json()["user_credential"]
        connector = User_Auth(user_auth)

        db_name = request.get_json()['db_name']
        table_name = request.get_json()['table_name']

        if connector.check_db(db_name) and connector.check_table(db_name, table_name):
            get_query = "SELECT * FROM " + "[" + db_name + "].[dbo].[" + table_name + "]"
            
            connector.execute(get_query)

            row_headers = [x[0] for x in connector.description()]

            rows = connector.fetchall()

            result = []
            
            for row in rows:
                result.append(dict(zip(row_headers, row)))
            
            if len(result) == 0:
                return jsonify({'status': 200, 'response': result, 'row_headers': row_headers}) 
            return jsonify({'status': 200, 'response': result})
        else:
            return jsonify({'status': 400, 'response': '[' + db_name + '].' + table_name + ' does not exist!'})
    except Exception as e:
        return jsonify({'status': 400, 'response': str(e)})

@app.route('/entries/delete', methods=['POST'])
def delete_all_table_entries():
    try:
        user_auth = request.get_json()["user_credential"]
        connector = User_Auth(user_auth, True)

        db_name = request.get_json()['db_name']
        table_name = request.get_json()['table_name']

        if connector.check_db(db_name):
            if connector.check_table(db_name, table_name):
                delete_entries_sql = "DELETE FROM [" + db_name + "].[dbo]." + "[" + table_name + "];"

                connector.execute(delete_entries_sql)

                if not connector.has_entries(db_name, table_name):
                    return jsonify({'status': 200, 'response': 'Successfully deleted entries in table named ' + table_name + ', in the database named ' + db_name})
                else:
                    return jsonify({'status': 400, 'response': 'Unable to delete the entries in the table named ' + table_name + '!'})
            else:
                return jsonify({'status': 404, 'response': 'Table named ' + table_name + ' does not exist in the database named ' + db_name + '!'})
        else:
            return jsonify({'status': 404, 'response': 'Database named ' + db_name + ' does not exist!'})
    except Exception as e:
        return jsonify({'status': 400, 'response': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
    # app.run()