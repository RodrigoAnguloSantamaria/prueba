import random
import json
import datetime
import os


def unixToStr(unix):
    return datetime.datetime.fromtimestamp(unix).strftime("%d-%m-%y")

def get_working_dates(start_date, end_date):
    # Creamos una lista para almacenar las fechas
    working_dates = []
    # Convertimos las fechas de entrada a objetos datetime
    start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d')
    end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d')
    print(start_date)
    print(end_date)
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
START_DATE = "2019-01-01"
END_DATE = "2023-06-30"
working_dates = get_working_dates(START_DATE, END_DATE)
# for working_date in working_dates[:-3]:
#       print()
# print(len(working_dates))
# print(len(working_dates[:-3]))
# Configuración
NUM_TRABAJADORES = 30
HORAS_DIARIAS = 8
TASK_IDS = ["T{:03d}".format(i) for i in range(1, 31)]
PROJECT_IDS = ["P{:03d}".format(i) for i in range(1, 31)]
USER_IDS = ["U{:03d}".format(i) for i in range(1, NUM_TRABAJADORES+1)]
SALARIOS = [15, 20, 25, 30, 40, 50, 100]
MIN_PROJECT_DURATION = 30
projects = []
total_workings_dates = len(working_dates)
projects.append(
  {"projectId": PROJECT_IDS[0], "startDate": working_dates[0], "endDate": working_dates[-1]})
for project_id in PROJECT_IDS[1:]:
    # Seleccionamos una fecha de inicio aleatoria de la lista de días laborables
    start_project = random.choice(working_dates[:-MIN_PROJECT_DURATION])
    start_index = working_dates.index(start_project)
    # print("start_index")
    # print(start_index)
    # Calculamos la fecha de fin
    end_index = random.randint(
        start_index+MIN_PROJECT_DURATION, total_workings_dates-1)
    # print("end_index")
    # print(end_index)
    end_project = working_dates[end_index]

    # print(unixToStr(start_project)+"    "+unixToStr(end_project))
    # print("-----------")
    projects.append(
        {"projectId": project_id, "startDate": start_project, "endDate": end_project})
users = []
for user in USER_IDS:
    random_projects = random.sample(projects, random.randint(1, 6))
    startWorking = random_projects[0]["startDate"]
    endWorking = random_projects[0]["endDate"]
    for project in random_projects:
        if(project["startDate"] < startWorking):
            startWorking = project["startDate"]
        if(project["endDate"] > endWorking):
            endWorking = project["endDate"]
    users.append({
        "userId": user,
        "projects_assigned": random_projects,
        "tasks_assigned": random.sample(TASK_IDS, random.randint(4, 11)),
        "salary_per_hour": random.choice(SALARIOS),
        "startWorking": startWorking,
        "endWorking": endWorking,
    })
# print(json.dumps(users,indent=1))


# Generamos los datos de actividad de cada trabajador
working_days = []

for date in working_dates:
    # Generamos las tareas que realiza el trabajador en ese día
    working_day_data_list = []

    for u in users:
        # Si en la fecha el trabajador no ha empezado a trabajar pasamos al siguiente
        if not(date in range(u["startWorking"], u["endWorking"])):
            continue
        horas_trabajadas = 0
        posibles_projects = u["projects_assigned"].copy()
        while horas_trabajadas < HORAS_DIARIAS:
            # Seleccionamos un proyecto aleatorio entre los disponibles
            if len(posibles_projects) == 0:
                # print("-------------------"+unixToStr(date))
                break
            project = random.choice(posibles_projects)
            # Si la fecha no esta entre las fechas de inicio y fin del proyecto entonces seleccionamos otro proyecto
            if date < project["startDate"] or date > project["endDate"]:
                posibles_projects = [
                    p for p in posibles_projects if p["projectId"] != project["projectId"]]
                continue
            # Seleccionamos una tarea aleatoria entre las disponibles
            task_id = random.choice(u["tasks_assigned"])
            project_id = project["projectId"]

            # Calculamos el tiempo que dedica el trabajador a la tarea
            time_spent = random.randint(1, 8)
            # Verificamos que no se sobrepase la jornada diaria
            if horas_trabajadas + time_spent > HORAS_DIARIAS:
                time_spent = HORAS_DIARIAS - horas_trabajadas
            horas_trabajadas += time_spent
            # Calculamos el coste de la tarea
            task_cost = time_spent * u["salary_per_hour"]
            # Generamos el workingDayId
            working_day_id = "{}{}{}".format(project_id, u["userId"], task_id)
            # Creamos el objeto con los datos de la tarea
            working_day_data = {
                "userId": u["userId"],
                "taskId": working_day_id,
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
    print(unixToStr(date))


# Obtenemos la ruta del script en ejecución
script_path = __file__
# Obtenemos la ruta del directorio del script
script_dir = os.path.dirname(script_path)

# Abrimos el archivo en modo escritura
with open(os.path.join(script_dir, "datos.json"), "w") as f:
    # Escribimos los datos en el archivo
    json.dump(working_days, f, indent=2)
