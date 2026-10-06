import pandas as pd
import sqlite3
import os
import random

def main():
    print("Cargando datasets...")
    d1 = pd.read_excel('Datasets/D1.xlsx')
    d2 = pd.read_excel('Datasets/D2.xlsx')
    d3 = pd.read_excel('Datasets/D3.xlsx')

    students_d1 = set(d1['student_id'].dropna().unique())
    students_d2 = set(d2['student_id'].dropna().unique())
    students_d3 = set(d3['student_id'].dropna().unique())

    common_students = students_d1.intersection(students_d2).intersection(students_d3)
    common_list = list(common_students)

    print(f"Estudiantes en D1: {len(students_d1)}")
    print(f"Estudiantes en D2: {len(students_d2)}")
    print(f"Estudiantes en D3: {len(students_d3)}")
    print(f"Total de estudiantes comunes: {len(common_list)}")

    if len(common_list) == 0:
        print("No hay estudiantes comunes!")
        return

    # Filtered datasets
    d1_filtered = d1[d1['student_id'].isin(common_list)]
    d2_filtered = d2[d2['student_id'].isin(common_list)]
    d3_filtered = d3[d3['student_id'].isin(common_list)]

    db_path = 'base de datos/estudiantes_comunes.db'
    os.makedirs('base de datos', exist_ok=True)
    
    print(f"Creando base de datos en {db_path}...")
    conn = sqlite3.connect(db_path)

    # Export to sqlite
    pd.DataFrame({'student_id': common_list}).to_sql('estudiantes', conn, index=False, if_exists='replace')
    d1_filtered.to_sql('D1_encuestas', conn, index=False, if_exists='replace')
    d2_filtered.to_sql('D2_servicios_apoyo', conn, index=False, if_exists='replace')
    d3_filtered.to_sql('D3_rendimiento_academico', conn, index=False, if_exists='replace')

    conn.close()
    print("Base de datos creada exitosamente.")

    print("\nEjemplos de student_id que puedes usar:")
    random.seed(42)
    examples = random.sample(common_list, min(5, len(common_list)))
    for e in examples:
        print(f"- {e}")

if __name__ == '__main__':
    main()
