import pandas as pd
import sqlite3

def build_main_table():
    db_path = 'base de datos/estudiantes_comunes.db'
    print(f"Conectando a {db_path}...")
    conn = sqlite3.connect(db_path)

    # 1. Cargar D1 (1 fila por estudiante)
    d1 = pd.read_sql_query("SELECT * FROM D1_encuestas", conn)

    # 2. Cargar D3 y agregar a nivel de estudiante
    d3 = pd.read_sql_query("SELECT * FROM D3_rendimiento_academico", conn)
    d3_agg = d3.groupby('student_id').agg(
        avg_grade_overall=('average_grade', 'mean'),
        avg_attendance_overall=('attendance_rate', 'mean'),
        total_periods=('period_id', 'count'),
        any_dropout_alert=('dropout_alert', 'max')
    ).reset_index()

    # 3. Cargar D2 y agregar a nivel de estudiante
    d2 = pd.read_sql_query("SELECT * FROM D2_servicios_apoyo", conn)
    d2_agg = d2.groupby('student_id').agg(
        total_support_requests=('support_event_id', 'count'),
        avg_wait_days=('wait_days', 'mean')
    ).reset_index()

    # 4. Unir todo en una sola tabla Main
    main_df = d1.merge(d3_agg, on='student_id', how='left')
    main_df = main_df.merge(d2_agg, on='student_id', how='left')

    # Rellenar nulos para los estudiantes que no pidieron servicios de apoyo
    main_df['total_support_requests'] = main_df['total_support_requests'].fillna(0)
    main_df['avg_wait_days'] = main_df['avg_wait_days'].fillna(0)

    # 5. Guardar como tabla 'Main' en la base de datos
    print("Creando tabla 'Main' con la información unificada de los 2278 estudiantes...")
    main_df.to_sql('Main', conn, index=False, if_exists='replace')

    conn.close()
    print("¡Tabla 'Main' creada con éxito!")
    print(f"Total de columnas en Main: {len(main_df.columns)}")
    print(f"Total de estudiantes: {len(main_df)}")

if __name__ == '__main__':
    build_main_table()
