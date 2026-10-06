import sqlite3
import random

first_names = ['Alejandro', 'Mateo', 'Sofia', 'Valentina', 'Santiago', 'Diego', 'Camila', 'Mariana', 'Leonardo', 'Valeria', 'Lucas', 'Isabella', 'Daniel', 'Victoria', 'Joaquin', 'Emilia', 'Gabriel', 'Martina', 'Tomas', 'Lucia', 'Andres', 'Catalina', 'Samuel', 'Renata', 'Juan', 'Mia']
last_names = ['Garcia', 'Martinez', 'Rodriguez', 'Lopez', 'Hernandez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Reyes', 'Morales', 'Cruz', 'Ortiz', 'Guti\u00e9rrez', 'Chavez', 'Ramos', 'Herrera', 'Medina', 'Aguilar', 'Vargas', 'Castillo']

def generate_names():
    db_path = 'base de datos/estudiantes_comunes.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all students
    cursor.execute("SELECT student_id FROM estudiantes")
    students = cursor.fetchall()
    
    # Try adding full_name column to D1_encuestas
    try:
        cursor.execute("ALTER TABLE D1_encuestas ADD COLUMN full_name TEXT")
    except sqlite3.OperationalError:
        pass # Column might already exist

    # Try adding full_name column to Main
    try:
        cursor.execute("ALTER TABLE Main ADD COLUMN full_name TEXT")
    except sqlite3.OperationalError:
        pass # Column might already exist

    random.seed(42) # For reproducibility
    
    for (student_id,) in students:
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        cursor.execute("UPDATE D1_encuestas SET full_name = ? WHERE student_id = ?", (name, student_id))
        cursor.execute("UPDATE Main SET full_name = ? WHERE student_id = ?", (name, student_id))

    conn.commit()
    conn.close()
    print("Nombres sintéticos asignados correctamente a los 2278 estudiantes.")

if __name__ == '__main__':
    generate_names()
