# HomeostasisJS

## 🚀 **Controla la Entropía de tus Proyectos JavaScript**

HomeostasisJS es un linter para la estructura de tus proyectos JavaScript. Con esta herramienta, puedes especificar y aplicar reglas claras para organizar tus carpetas y archivos, asegurando que el crecimiento de tu proyecto sea consistente y mantenible.

---

### **¿Por qué HomeostasisJS?**

A medida que los proyectos crecen, es común que la estructura se vuelva caótica, lo que puede llevar a:

- **Dificultad para encontrar archivos.**
- **Altos costos de mantenimiento.**
- **Curvas de aprendizaje más largas para nuevos desarrolladores.**

HomeostasisJS resuelve estos problemas permitiéndote definir desde el principio las convenciones de tu proyecto y asegurando que estas se respeten automáticamente. ¡Olvídate de revisiones manuales y asegura la calidad de tu estructura! 💡

1. **Crea un archivo descriptor:**  
   En cada carpeta que desees controlar, agrega un archivo `descriptor.json` con la configuración específica. Ejemplo:

```json
{
  "directories": {
    "strict_content": false,
    "convention": "kebab-case",
    "content": [
      {
        "name": "components",
        "description": "Contiene los componentes reutilizables de la aplicación"
      },
      {
        "name": "pages",
        "description": "Contiene las páginas principales de la aplicación"
      },
      {
        "name": "hooks",
        "description": "Almacena hooks personalizados"
      },
      {
        "name": "contexts",
        "description": "Define los contextos globales para el estado"
      },
      {
        "name": "services",
        "description": "Contiene lógica para integraciones con APIs"
      },
      {
        "name": "utils",
        "description": "Funciones de utilidad compartidas en el proyecto"
      },
      {
        "name": "assets",
        "description": "Archivos estáticos como imágenes, estilos, y fuentes"
      },
      {
        "name": "styles",
        "description": "Define los estilos globales o temas de la aplicación"
      }
    ]
  },
  "files": {
    "convention": "kebab-case",
    "strict_content": false,
    "limit": 2,
    "content": [
      {
        "name": "index.ts",
        "description": "Archivo que exporta components"
      }
    ]
  }
}
```

- **`directories`:** Reglas para carpetas (estrictas o con convenciones).
- **`files`:** Reglas para archivos, incluyendo límite de archivos y contenido esperado.

Convenciones soportadas: `camel-case`, `snake-case`, `kebab-case`, `pascal-case`.
