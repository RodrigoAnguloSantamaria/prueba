import random
import json
import datetime
import os


def get_working_dates(start_date, end_date):
    # Creamos una lista para almacenar las fechas
    working_dates = []
    # Convertimos las fechas de entrada a objetos datetime
    start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d')
    print({start_date, end_date})
    # Recorremos cada día del rango de fechas
    current_date = start_date
    while current_date <= end_date:
        # Si el día es lunes a viernes, lo añadimos a la lista
        if current_date.weekday() < 5:
            working_dates.append(int(current_date.timestamp()))
        # Pasamos al siguiente día
        current_date += datetime.timedelta(days=1)
    # Devolvemos la lista de fechas
    return working_dates

# Prueba de uso del método
start_date = "2021-01-01"
end_date = "2023-06-30"
# Configuración
NUM_TRABAJADORES = 20
TASK_IDS = ["T{:03d}".format(i) for i in range(1, 31)]
PROJECT_IDS = ["P{:03d}".format(i) for i in range(1, 31)]
USER_IDS = ["U{:03d}".format(i) for i in range(1, NUM_TRABAJADORES+1)]
SALARIOS = [15, 20, 25, 30, 40, 50, 100]
HORAS_DIARIAS = 8
tasks_assigned = []
projects_assigned = []
for user_id in USER_IDS:
    # Generamos una lista aleatoria de tareas para el trabajador
    tasks_assigned = random.sample(TASK_IDS, random.randint(4, 11))
    # Generamos una lista aleatoria de proyectos para el trabajador
    projects_assigned = random.sample(PROJECT_IDS, random.randint(1, 6))

working_dates = get_working_dates(start_date, end_date)


# Generamos los datos de actividad de cada trabajador
working_days = []

for date in working_dates:
  # Generamos las tareas que realiza el trabajador en ese día
  working_day_data_list = []

  for user_id in USER_IDS:
      horas_trabajadas = 0
      while horas_trabajadas < HORAS_DIARIAS:
          # Seleccionamos una tarea aleatoria entre las disponibles
          task_id = random.choice(tasks_assigned)
          # Seleccionamos un proyecto aleatorio entre los disponibles
          project_id = random.choice(projects_assigned)
          # Calculamos el salario por hora del trabajador
          salario_hora = random.choice(SALARIOS)
          # Calculamos el tiempo que dedica el trabajador a la tarea
          time_spent = random.randint(1, 8)
          # Verificamos que no se sobrepase la jornada diaria
          if horas_trabajadas + time_spent > HORAS_DIARIAS:
              time_spent = HORAS_DIARIAS - horas_trabajadas
          horas_trabajadas += time_spent
          # Calculamos el coste de la tarea
          task_cost = time_spent * salario_hora
          # Generamos el workingDayId
          working_day_id = "{}{}{}".format(project_id, user_id, task_id)
          # Creamos el objeto con los datos de la tarea
          working_day_data = {
              "userId": user_id,
              "taskId": f"{project_id}{user_id}{task_id}",
              "timeSpent": time_spent,
              "taskCost": task_cost
          }
          # Añadimos la tarea a la lista de tareas del día
          working_day_data_list.append(working_day_data)
      # Añadimos el día de trabajo al diccionario de días de trabajo
  working_days.append({
      "workingDate": date,
      "workingDayDataList": working_day_data_list
  })
# Obtenemos la ruta del script en ejecución
script_path = __file__
# Obtenemos la ruta del directorio del script
script_dir = os.path.dirname(script_path)

# Abrimos el archivo en modo escritura
with open(os.path.join(script_dir, "datos.json"), "w") as f:
    # Escribimos los datos en el archivo
    json.dump(working_days, f, indent=2)
