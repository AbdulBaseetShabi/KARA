import pyodbc

class Connector:
    def __init__(self, driver="MySQL ODBC 8.0 Unicode Driver", server="localhost", uid="root", password="", autocommit=False):
        connection_string = (
            f'DRIVER={driver};'
            f'SERVER={server};'
            f'UID={uid};'
            f'PWD={password};'
            'charset=utf8mb4;'
            'Trusted_Connection=yes;'
        )

        self._conn = pyodbc.connect(connection_string, autocommit=autocommit)
        self._cursor = self._conn.cursor()

    def execute(self, query, values=None):
        if values is None:
            self._cursor.execute(query)
        else:
            self._cursor.execute(query, values)

    def commit(self):
        self._conn.commit()

    def fetchall(self):
        return self._cursor.fetchall()

    def rowcount(self):
        return self._cursor.rowcount

    def lastrowid(self):
        id_sql = "SELECT @@IDENTITY AS ID;"

        self._cursor.execute(id_sql)

        return self._cursor.fetchone()[0]

    def description(self):
        return self._cursor.description

    def check_db(self, name):
        self._cursor.execute("SELECT name FROM sys.databases")

        for (db,) in self._cursor:
            if db.lower() == name.lower():
                return True
        return False

    def check_table(self, db, name):
        use_db = "USE " + "[" + db + "];"

        self._cursor.execute(use_db)

        self._cursor.execute("SELECT name FROM sys.tables")

        for (table, ) in self._cursor:
            if table.lower() == name.lower():
                return True

        return False  

    def has_entries(self, db, name):
        use_db = "USE " + "[" + db + "];"

        self._cursor.execute(use_db)

        self._cursor.execute("SELECT * FROM " + name)
        
        entries = self._cursor.fetchall()

        return len(entries) != 0
