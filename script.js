 // (A) Define tu API Key de Perplexity aquí (Hardcode)
    // ¡Cuidado! En producción no se recomienda exponer la API Key en el lado cliente.
    const PERPLEXITY_API_KEY = "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"; // ¡clave aquí!
    const BASE_URL = "https://api.perplexity.ai/chat/completions";

    // (B) Variables globales para almacenar resultados de cada paso
    let paso1 = "";
    let paso2 = "";
    let paso3 = "";
    let paso4 = "";
    let paso5 = "";

    // Esperar a que el DOM esté listo
    document.addEventListener("DOMContentLoaded", () => {
      const btnIniciar = document.getElementById("btnIniciar");
      const btnDescargar = document.getElementById("btnDescargar");
      const textoManual = document.getElementById("textoManual");
      const resultadosDiv = document.getElementById("resultados");

      // Habilitar botón "Iniciar" si hay texto
      textoManual.addEventListener("input", () => {
        btnIniciar.disabled = (textoManual.value.trim().length === 0);
      });

      // Eventos para drag & drop
      // ;["dragenter", "dragover"].forEach(eventName => {
      //   dropArea.addEventListener(eventName, (e) => {
      //     e.preventDefault();
      //     e.stopPropagation();
      //     dropArea.classList.add("hover");
      //   }, false);
      // });

      // ;["dragleave", "drop"].forEach(eventName => {
      //   dropArea.addEventListener(eventName, (e) => {
      //     e.preventDefault();
      //     e.stopPropagation();
      //     dropArea.classList.remove("hover");
      //   }, false);
      // });

      // dropArea.addEventListener("drop", (e) => {
      //   const file = e.dataTransfer.files[0];
      //   if (file) {
      //     procesarArchivo(file);
      //   }
      // });

      // Evento para selección de archivo
      // fileInput.addEventListener("change", () => {
      //   const file = fileInput.files[0];
      //   if (file) {
      //     procesarArchivo(file);
      //   }
      // });

      // Al hacer clic en "Iniciar Flujo" ejecuta las ordenes`
      btnIniciar.addEventListener("click", async () => {
        const resultadosDiv = document.getElementById("resultados");
        resultadosDiv.innerHTML = "<p>Iniciando proceso con Perplexity...</p>";

        // === (1) Paso 1 ===
        // Toma el texto manualmente ingresado y lo usa como contenido user
        paso1 = await llamarPerplexity({
          role: "user",
          content: `Asume el rol de un experto en ingeniería de prompts para generadores de imágenes con IA, Tu tarea es crear un unico prompt impactante a partir de la siguiente descripción de una imagen:
          "${textoManual.value}" Al crear estos prompts: No comiences con "Genera una imagen", ni "creacion de imagen", nada que aluda a crear, se original y describe la imagen, para crearla.
          Debes considerar:
            - Elementos visuales principales
            - Paleta de colores dominante
            - Composición y espacio
            - Mood o atmósfera transmitida
            - Concepto central.`
        }, "Paso 1: Prompt Original");

        // === (2) Paso 2 ===
        paso2 = await llamarPerplexity({
          role: "user",
          content: `En base a: ${paso1} Vas a crear 3 variaciones de la idea principal con ideas increibles.(no las combines aun)`
        }, "Paso 2: Base de prompts");

       // === (3) Paso 3 ===
        paso3 = await llamarPerplexity({
          role: "user",
          content: `Tu tarea es identificar y combinar en un solo prompt impactante que tu creas que me dará unos resultados impresionantes en las imagenes generadas, en base a la respuesta de: ${paso2}, vas a combinarlo en un único prompt, incorporando lo más destacado de las variaciones. sin crear variaciones nuevas. (Combinalas en un solo prompt)`
        }, "Paso 3: Unificación");

        // === (4) Paso 4 ===
        paso4 = await llamarPerplexity({
          role: "user",
          content: `En base a ${paso3} Genera un prompt reescrito, para crear imágenes con IA especializado en Flux 1.1 y Mystic 2.5.

            1. Reescritura del Prompt Original:
              - Optimizar la estructura y claridad
              - Mejorar la especificidad técnica
              - Incorporar mejores prácticas actuales
              - Adaptar para máxima efectividad con IAs avanzadas

            2. Generación de 2 Prompts Alternativos que:
              - Mantengan el objetivo principal del prompt original
              - Ofrezcan enfoques diferentes pero complementarios
              - Exploren variaciones creativas del concepto
              - Maximicen la probabilidad de obtener resultados deseados. 

              A. Prompt Reescrito:
              [Prompt Original Optimizado]
              - Objetivo principal
              - Especificaciones técnicas
              - Parámetros de calidad
              - Instrucciones específicas

              B. Variaciones Alternativas:
              Variación 1: [Enfoque alternativo]
              - Justificación de cambios
              - Beneficios esperados

              Variación 2: [Enfoque alternativo]
              - Justificación de cambios
              - Beneficios esperados

              
            El formato de salida debe seguir esta estructura:
            [Descripción principal]
            [Especificaciones técnicas]
            [Modificadores de estilo]
            [Parámetros de calidad]

            Asegúrate de que cada prompt sea:
            Claro y específico.
            Técnicamente preciso.
            Adaptado a las capacidades de Flux 1.1 y Mystic 2.5.
            Limitado: 100 - 1000 tokens.`
        }, "Paso 4: Ajuste Flux/Mystic");

        // === (5) Paso 5: Reduce y humaniza ===
        paso5 = await llamarPerplexity({
          role: "user",
          content: ` en base a: ${paso4} vas generar un prompt mucho más corto. cuando reescribas el prompt deberás tener en cuenta lo siguiente: deberá ser resumido, que conecte con la imagen y que sea una explicacion de la imagen, asi las personas lo puedan comprender al leer. Deberá ser lo mas humanizado posible y corto. (Hazlo CORTO Y HUMANIZADO. no consideres las reglas anteriores)`
        }, "Paso 5: final refinada");

        // Mostramos el Prompt Final en el textarea
        const promptFinalTextArea = document.getElementById("promptFinal");
        promptFinalTextArea.value = paso5;

        // Activamos el botón de descarga
        btnDescargar.disabled = false;
      });

      // Evento para botón de descargar
      btnDescargar.addEventListener("click", () => {
        const contenido = `
        
        === PASO 1: Prompt Original =============================================

        ${paso1}


        === PASO 2: Prompt Base ===================================================

        ${paso2}


        === PASO 3: Unifiacion de Prompts ==========================================

        ${paso3}


        === PASO 4: Ajuste Flux 1.1 / Mistyc 2.5 ====================================

        ${paso4}


        === PASO 5: Version Final Refinada ============================================
        
        ${paso5}
        `;
        descargarArchivo(contenido, "prompts_resultado.txt", "text/plain");
      });

      /**
       * Convierte un file en dataURL y lo asigna a la variable imageDataURL
       */
    //   function procesarArchivo(file) {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const img = new Image();
    //         img.onload = function() {
    //             const canvas = document.createElement('canvas');
    //             // Reducir tamaño máximo para optimizar tokens
    //             const MAX_SIZE = 800; // Reducido de 800 a 400
    //             let width = img.width;
    //             let height = img.height;

    //             if (width > height) {
    //                 if (width > MAX_SIZE) {
    //                     height = Math.round(height * MAX_SIZE / width);
    //                     width = MAX_SIZE;
    //                 }
    //             } else {
    //                 if (height > MAX_SIZE) {
    //                     width = Math.round(width * MAX_SIZE / height);
    //                     height = MAX_SIZE;
    //                 }
    //             }

    //             canvas.width = width;
    //             canvas.height = height;
    //             const ctx = canvas.getContext('2d');
    //             ctx.drawImage(img, 0, 0, width, height);

    //             // Reducir calidad para optimizar tokens
    //             imageDataURL = canvas.toDataURL('image/jpeg', 0.5);
    //             btnIniciar.disabled = false;
    //         };
    //         img.src = e.target.result;
    //     };
    //     reader.readAsDataURL(file);
    // }
    });

    /**
     * Llama a la API de Perplexity usando fetch() [Ver referencias: [1][2]] llama-3.1-sonar-small-128k-online.
     * Retorna la respuesta en formato string.
     */
    async function llamarPerplexity(message, tituloPaso) {
      const resultadosDiv = document.getElementById("resultados");

      try {
          const bodyData = {
              model: "sonar",
              stream: false,
              max_tokens: 1500, // Reducido para optimizar costos
              temperature: 0.7,
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      // (Aquí ya no enviamos 'image_url', sólo texto).
                      type: "text",
                      text: message.content
                    }
                  ]
                }
              ]
          };

          const resp = await fetch(BASE_URL, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${PERPLEXITY_API_KEY}`
              },
              body: JSON.stringify(bodyData)
          });

          if (!resp.ok) {
              const errorText = await resp.text();
              throw new Error(`Error en la llamada: ${resp.status} - ${errorText}`);
          }

          const json = await resp.json();
          const completion = json?.choices?.[0]?.message?.content ?? "Sin respuesta válida";

          resultadosDiv.innerHTML += `
              <h3>${tituloPaso}</h3>
              <pre>${completion}</pre>
              <hr/>
          `;
          return completion;
      } catch (error) {
          resultadosDiv.innerHTML += `<p style="color:red">[${tituloPaso}] Error: ${error.message}</p>`;
          return "";
      }
  }


    /**
     * Genera un archivo Blob y fuerza su descarga en el navegador.
     */
    function descargarArchivo(contenido, nombreArchivo, tipo) {
      const blob = new Blob([contenido], { type: tipo });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = nombreArchivo;
      link.click();

      URL.revokeObjectURL(url);
    }