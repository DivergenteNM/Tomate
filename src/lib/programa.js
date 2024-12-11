export const programa = `
:- dynamic(paso/1).   % Paso actual en el sistema.
:- dynamic(plaga/1).  % Plaga identificada.
:- dynamic(sintoma/1). % Síntoma observado.
:- dynamic(calidad_agua/1). % Calidad de agua observada.
:- dynamic(rotacion/1). % Información sobre rotación de cultivos.
:- dynamic(enfermedad/1). % Enfermedad identificada.
:- dynamic(clima/1). % Condición climática observada.
:- dynamic(ultima_respuesta/1). % Última respuesta proporcionada por el usuario.

% Paso inicial: Selección de diagnóstico
regla(Respuesta):- 
    (paso(_) -> 
        fail
    ; 
        !, ListaPasos = ['PREGUNTA', '¿Qué aspecto del cultivo desea revisar?', 'Enfermedades', 'Calidad del agua', 'Rotación de cultivos', 'Plagas', 'Condiciones climáticas'],
        Respuesta = ListaPasos,
        retractall(paso(_)),
        assertz(paso('Seleccionar Categoria'))
    ).

regla(Respuesta):-
    (paso('Seleccionar Categoria') ->
        !,retractall(paso(_)),!,
        assertz(paso(Respuesta))
    ).


% Preparación para enfermedad
regla(Respuesta):- 
    (paso('Enfermedades') -> 
        !, 
        Respuesta = ['PREGUNTA', '¿Qué síntoma observa en las plantas?', 'Hojas amarillentas', 'Manchas negras', 'Manchas marrones en hojas', 'Tallos quebradizos', 'Bordes mojados'],
        retractall(paso(_)),
        assertz(paso('Registrar Sintoma'))
    ).

% Preparación para calidad de agua
regla(Respuesta):- 
    (paso('Calidad del agua') -> 
        !, 
        Respuesta = ['PREGUNTA', '¿Qué problema ha notado con la calidad del agua?', 'Mala calidad', 'Sedimentos', 'Contaminada'],
        retractall(paso(_)),
        assertz(paso('Registrar Calidad Agua'))
    ).

% Preparación para rotación de cultivos
regla(Respuesta):- 
    (paso('Rotación de cultivos') -> 
        !, 
        Respuesta = ['PREGUNTA', '¿Qué aspecto de la rotación le interesa?', 'Mejora del suelo', 'Descanso del invernadero'],
        retractall(paso(_)),
        assertz(paso('Registrar Rotacion'))
    ).

% Preparación para plagas
regla(Respuesta):- 
    (paso('Plagas') -> 
        !, 
        Respuesta = ['PREGUNTA', '¿Qué síntoma de plaga ha observado?', 'Capa pegajosa', 'Bichitos verdes', 'Trips', 'Mosca blanca'],
        retractall(paso(_)),
        assertz(paso('Registrar Plaga'))
    ).

% Preparación para condiciones climáticas
regla(Respuesta):- 
    (paso('Condiciones climáticas') -> 
        !, 
        Respuesta = ['PREGUNTA', '¿Qué condición climática ha notado?', 'Calor', 'Humedad Alta', 'Sequía'],
        retractall(paso(_)),
        assertz(paso('Registrar Clima'))
    ).

% Registro del síntoma en caso de enfermedad
regla(Respuesta):- 
    (paso('Registrar Sintoma') -> 
        retractall(paso(_)),
        assertz(paso('Comprobar Sintoma')),
        assertz(sintoma(Respuesta))
    ).

% Comprobación de síntoma y diagnóstico para enfermedades
regla(Respuesta):- 
    (paso('Comprobar Sintoma'), sintoma('Hojas amarillentas') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Este síntoma puede indicar una deficiencia de nutrientes esenciales o una infestación por mosca blanca. Se recomienda realizar un análisis de nutrientes del suelo y observar el envés de las hojas en busca de insectos. Si se confirma la presencia de plagas aplicar un insecticida adecuado.'],
        retractall(paso(_)),
        retractall(sintoma(_))
    ).

regla(Respuesta):- 
    (paso('Comprobar Sintoma'), sintoma('Manchas negras') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Las manchas negras en las hojas podrían ser causadas por una infección por Alternaria un hongo común en cultivos de tomate. Es importante retirar las hojas afectadas y aplicar un fungicida específico para controlar la propagación. Asegúrese de mantener una buena ventilación en el invernadero.'],
        retractall(paso(_)),
        retractall(sintoma(_))
    ).

regla(Respuesta):- 
    (paso('Comprobar Sintoma'), sintoma('Manchas marrones en hojas') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Las manchas marrones suelen estar asociadas a infecciones fúngicas. Se recomienda utilizar fungicidas adecuados y monitorear las condiciones de humedad ya que los hongos prosperan en ambientes húmedos. Mantener el cultivo seco y bien ventilado puede prevenir futuros brotes.'],
        retractall(paso(_)),
        retractall(sintoma(_))
    ).

regla(Respuesta):- 
    (paso('Comprobar Sintoma'), sintoma('Tallos quebradizos') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Los tallos quebradizos son una señal clara de deficiencia de calcio en las plantas. Considere agregar enmiendas de calcio al suelo como yeso agrícola y asegúrese de que el sistema de riego permita una distribución uniforme de los nutrientes.'],
        retractall(paso(_)),
        retractall(sintoma(_))
    ).

regla(Respuesta):- 
    (paso('Comprobar Sintoma'), sintoma('Bordes mojados') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Este síntoma puede ser indicativo de mildiu una enfermedad causada por hongos que prosperan en condiciones de alta humedad. Es crucial aplicar fungicidas específicos para mildiu y reducir la humedad en el entorno del cultivo mediante una ventilación adecuada.
'],
        retractall(paso(_)),
        retractall(sintoma(_))
    ).

% Registro de la calidad del agua
regla(Respuesta):- 
    (paso('Registrar Calidad Agua') -> 
        retractall(paso(_)),
        assertz(paso('Comprobar Calidad Agua')),
        assertz(calidad_agua(Respuesta))
    ).

% Comprobación de calidad del agua
regla(Respuesta):- 
    (paso('Comprobar Calidad Agua'), calidad_agua('Mala calidad') -> 
        !, 
        Respuesta = ['RESPUESTA', 'El agua de mala calidad puede contener sales o minerales en exceso que afectan negativamente a las plantas. Se recomienda realizar un análisis del agua y si es necesario instalar un sistema de filtración o desalinización para mejorar su calidad.
'],
        retractall(paso(_)),
        retractall(calidad_agua(_))
    ).

regla(Respuesta):- 
    (paso('Comprobar Calidad Agua'), calidad_agua('Sedimentos') -> 
        !, 
        Respuesta = ['RESPUESTA', 'La presencia de sedimentos en el agua puede obstruir los sistemas de riego y afectar la salud de las plantas. Considere instalar filtros en el sistema de riego para eliminar estas partículas y garantizar un flujo limpio de agua.'],
        retractall(paso(_)),
        retractall(calidad_agua(_))
    ).


regla(Respuesta):- 
    (paso('Comprobar Calidad Agua'), calidad_agua('Contaminada') -> 
        !, 
        Respuesta = ['RESPUESTA', 'El uso de agua contaminada puede introducir patógenos o químicos dañinos al cultivo. Se recomienda tratar el agua con un sistema de purificación como filtros de carbono o luz ultravioleta antes de utilizarla para el riego.'],
        retractall(paso(_)),
        retractall(calidad_agua(_))
    ).


% Registro de la rotación de cultivos
regla(Respuesta):- 
    (paso('Registrar Rotacion') -> 
        retractall(paso(_)),
        assertz(paso('Comprobar Rotacion')),
        assertz(rotacion(Respuesta))
    ).

% Comprobación de la rotación de cultivos
regla(Respuesta):- 
    (paso('Comprobar Rotacion'), rotacion('Mejora del suelo') -> 
        !, 
        Respuesta = ['RESPUESTA', 'La rotación de cultivos puede mejorar significativamente la calidad del suelo al reducir la acumulación de patógenos y plagas específicas de un cultivo en particular. Además al alternar cultivos con diferentes necesidades nutricionales se puede mantener un equilibrio de nutrientes en el suelo. Considere incluir cultivos fijadores de nitrógeno como leguminosas para enriquecer el suelo naturalmente.'],
        retractall(paso(_)),
        retractall(rotacion(_))
    ).

regla(Respuesta):- 
    (paso('Comprobar Rotacion'), rotacion('Descanso del invernadero') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Permitir un período de descanso para el invernadero ayuda a interrumpir el ciclo de vida de plagas y enfermedades específicas. Durante este tiempo se recomienda limpiar profundamente el área eliminar restos de plantas y esterilizar herramientas y estructuras para reducir riesgos futuros. También puede considerar cubrir el suelo con mantas plásticas para realizar un proceso de solarización que ayuda a eliminar organismos patógenos en el suelo.'],
        retractall(paso(_)),
        retractall(rotacion(_))
    ).

% Registro de plaga
regla(Respuesta):- 
    (paso('Registrar Plaga') -> 
        retractall(paso(_)),
        assertz(paso('Comprobar Plaga')),
        assertz(plaga(Respuesta))
    ).

regla(Respuesta):- 
    (paso('Comprobar Plaga'), plaga('Capa pegajosa') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Una capa pegajosa en las hojas puede ser un signo de la presencia de áfidos (pulgones) que secretan una sustancia llamada melaza. Esta melaza puede propiciar el crecimiento de hongos como la fumagina. Se recomienda utilizar jabón potásico o aceite de neem para controlar los áfidos de forma efectiva.'],
        retractall(paso(_)),
        retractall(plaga(_))
    ).
% Predicado para almacenar la última respuesta del usuario
registra_respuesta(Respuesta):- 
    retractall(ultima_respuesta(_)),
    assertz(ultima_respuesta(Respuesta)).

regla(Respuesta):- 
    (paso('Comprobar Plaga'), plaga('Bichitos verdes') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Una capa pegajosa en las hojas puede ser un signo de la presencia de áfidos (pulgones) que secretan una sustancia llamada melaza. Esta melaza puede propiciar el crecimiento de hongos como la fumagina. Se recomienda utilizar jabón potásico o aceite de neem para controlar los áfidos de forma efectiva.'],
        retractall(paso(_)),
        retractall(plaga(_))
    ).

regla(Respuesta):- 
    (paso('Elegir Opción') -> 
        !, 
        Respuesta = ['PREGUNTA', '¿Qué deseas saber?', 'Más información', 'Sugerencias para tratar.'],
        registra_respuesta(Respuesta),
        retractall(paso(_)),
        assertz(paso('Procesar Opción'))
    ).


    %No muestra más información o sugerencias para tratar
regla(Respuesta):- 
    (paso('Procesar Opción'), ultima_respuesta('Más información') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Los pulgones son insectos pequeños que se alimentan de la savia de las plantas, debilitándolas.'],
        retractall(paso(_)),
        retractall(ultima_respuesta(_))
    ).

regla(Respuesta):- 
    (paso('Procesar Opción'), ultima_respuesta('Sugerencias para tratar.') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Para tratar la infestación de pulgones, se puede aplicar un insecticida específico para pulgones o usar métodos naturales como la liberación de mariquitas.'],
        retractall(paso(_)),
        retractall(ultima_respuesta(_))
    ).





regla(Respuesta):- 
    (paso('Comprobar Plaga'), plaga('Trips') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Los trips son insectos diminutos que se alimentan perforando las células de las hojas causando decoloración y puntos plateados. Se recomienda usar trampas adhesivas de color azul para monitorearlos y aplicar insecticidas específicos si la infestación es severa.'],
        retractall(paso(_)),
        retractall(plaga(_))
    ).
   
regla(Respuesta):- 
    (paso('Comprobar Plaga'), plaga('Mosca blanca') -> 
        !, 
        Respuesta = ['RESPUESTA', 'La mosca blanca es una plaga común en invernaderos y puede transmitir enfermedades virales a las plantas. Controle la mosca blanca mediante la instalación de trampas amarillas adhesivas y la aplicación de productos como aceite de neem o extractos de ajo. También se pueden emplear parasitoides naturales como Encarsia formosa.'],
        retractall(paso(_)),
        retractall(plaga(_))
    ).


% Registro del clima
regla(Respuesta):- 
    (paso('Registrar Clima') -> 
        retractall(paso(_)),
        assertz(paso('Comprobar Clima')),
        assertz(clima(Respuesta))
    ).

% Comprobación de clima
regla(Respuesta):- 
    (paso('Comprobar Clima'), clima('Calor') -> 
        !, 
        Respuesta = ['RESPUESTA', 'Las altas temperaturas pueden causar estrés térmico en las plantas reduciendo su rendimiento y calidad. Se recomienda:, Instalar mallas de sombreo para reducir la intensidad solar., Aumentar la frecuencia del riego para mantener una hidratación adecuada.,Utilizar mulching (cobertura del suelo) para conservar la humedad.'],
        retractall(paso(_)),
        retractall(clima(_))
    ).

regla(Respuesta):- 
    (paso('Comprobar Clima'), clima('Humedad Alta') -> 
        !, 
        Respuesta = ['RESPUESTA', 'La alta humedad favorece el desarrollo de enfermedades fúngicas como el mildiu y la botritis. Para mitigar sus efectos:, Mejore la ventilación del invernadero o del área de cultivo., Evite el riego por aspersión en las tardes o noches., Aplique fungicidas preventivos si las condiciones de humedad persisten.'],
        retractall(paso(_)),
        retractall(clima(_))
    ).

regla(Respuesta):- 
    (paso('Comprobar Clima'), clima('Sequía') -> 
        !, 
        Respuesta = ['RESPUESTA', 'La sequía puede causar marchitez quemaduras en las hojas y disminución en el rendimiento del cultivo. Las recomendaciones incluyen:, Implementar sistemas de riego por goteo para un uso eficiente del agua., Utilizar variedades de tomate resistentes a la sequía., Mejorar la capacidad del suelo para retener agua mediante enmiendas orgánicas como compost o turba.'],
        retractall(paso(_)),
        retractall(clima(_))
    ).

limpiar:-
    retractall(paso(_)),
    retractall(plaga(_)),
    retractall(sintoma(_)),
    retractall(calidad_agua(_)),
    retractall(rotacion(_)),
    retractall(enfermedad(_)),
    retractall(clima(_)),
    retractall(ultima_respuesta(_)).
`;