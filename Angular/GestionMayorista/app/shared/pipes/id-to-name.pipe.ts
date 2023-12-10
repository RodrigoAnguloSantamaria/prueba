import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idToNamePipe',
})
export class IdToNamePipe implements PipeTransform {
  transform(id: string): string {
    let result: string | undefined = idsMap.get(id);
    if (result === undefined) {
      // console.error("No hay nombre asociado al id: " + id);
      result = 'ERROR';
    }
    return result;
  }
  tranformNameToID(name: string): string {
    let result: string = '';
    for(let [k,v] of idsMap.entries()){
      if(v === name){
        result = k;
      }
    }
    return result;
  }
}
const idsMap = new Map<string, string>([
  //Ids projects
  ["P001", "Gestión de Actividad"],
  ["P002", "Canal de Denuncias"],
  ["P003", "Chat Bot"],
  ["P004", "Monitorización de Ciberseguridad"],
  ["P005", "Sistema de Reservas"],
  ["P006", "Aplicación de Pagos"],
  ["P007", "Plataforma de e-learning"],
  ["P008", "Sistema de gestión de inventarios"],
  ["P009", "Sistema de gestión de pedidos"],
  ["P010", "Sistema de gestión de seguimiento"],
  ["P011", "Sistema de gestión de incidentes"],
  ["P012", "Plataforma de marketing automatizado"],
  ["P013", "Sistema de gestión de tiempo"],
  ["P014", "Sistema de gestión de proyectos"],
  ["P015", "Sistema de gestión de recursos humanos"],
  ["P016", "Sistema de gestión de facturas"],
  ["P017", "Sistema de gestión de seguridad de la información"],
  ["P018", "Sistema de gestión de la calidad"],
  ["P019", "Sistema de gestión de la relación con el cliente"],
  ["P020", "Sistema de gestión de la cadena de suministro"],
  ["P021", "Sistema de gestión de la comunicación"],
  ["P022", "Sistema de gestión de la inteligencia artificial"],
  ["P023", "Sistema de gestión de la movilidad"],
  ["P024", "Sistema de gestión de la nube"],
  ["P025", "Sistema de gestión de la energía"],
  ["P026", "Sistema de gestión de la logística"],
  ["P027", "Sistema de gestión de la logística"],
  ["P028", "Sistema de seguimiento de proyectos"],
  ["P029", "Sistema de gestión de la calidad del aire"],
  ["P030", "Sistema de gestión de la seguridad en el trabajo"],
  //Ids tareas
  ["T001", 'Programar'],
  ["T002", 'Documentar'],
  ["T003", 'Testear'],
  ["T004", 'Reuniones'],
  ["T005", 'Análisis de requerimientos'],
  ["T006", 'Diseño de bases de datos'],
  ["T007", 'Administración de servidores'],
  ["T008", 'Solución de problemas'],
  ["T009", 'Gestión de proyectos'],
  ["T010", 'Capacitación'],
  ["T011", 'Desarrollo de aplicaciones'],
  ["T012", 'Integración de sistemas'],
  ["T013", 'Monitoreo'],
  ["T014", 'Seguridad informática'],
  ["T015", 'Revisión de código'],
  ["T016", 'Soporte al usuario'],
  ["T017", 'Optimización'],
  ["T018", 'Creación de manuales'],
  ["T019", 'Coordinación con terceros'],
  ["T020", 'Participación en eventos'],
  ["T021", 'Gestión de inventario'],
  ["T022", 'Inteligencia Artificial'],
  ["T023", 'Cloud computing'],
  ["T024", 'Metodologías ágiles'],
  ["T025", 'Investigación y evaluación'],
  ["T026", 'Liderazgo'],
  ["T027", 'Auditorías de seguridad'],
  ["T028", 'Buenas prácticas'],
  ["T029", 'Documentación técnica'],
  ["T030", 'Prospección de clientes'],
  // Ids users
  ["U001", "Javier Blanco Guadalupe"],
  ["U002", "Maria Ortiz Rodriguez"],
  ["U003", "Carlos Gomez Perez"],
  ["U004", "Ana Lopez Rodriguez"],
  ["U005", "Juan Garcia Rodriguez"],
  ["U006", "Pedro Martinez Hernandez"],
  ["U007", "Lucia Gonzalez Fernandez"],
  ["U008", "Ricardo Rodriguez Garcia"],
  ["U009", "Ana Pérez López"],
  ["U010", "José Jiménez Ortiz"],
  ["U011", "Sofia Castro Ortiz"],
  ["U012", "Juan Hernandez"],
  ["U013", "Pedro Fernández"],
  ["U014", "Lopez Fernández"],
  ["U015", "Juan García"],
  ["U016", "Ana Ortiz"],
  ["U017", "Sofia García"],
  ["U018", "José Fernández"],
  ["U019", "Lucia Castro"],
  ["U020", "Javier Ortiz"],
  ["U021", "Maria Hernandez"],
  ["U022", "Carlos Garcia"],
  ["U023", "Ana Pérez"],
  ["U024", "Juan Jiménez"],
  ["U025", "Pedro Castro"],
  ["U026", "Lucia Ortiz"],
  ["U027", "Ricardo Hernandez"],
  ["U028", "Ana Garcia"],
  ["U029", "José Fernández"],
  ["U030", "Sofia Ortiz"]
]);
