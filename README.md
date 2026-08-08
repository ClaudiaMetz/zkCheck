<p align="center">
  <img src="./assets/logo.png" alt="Logo ZKcheck" width="80" />
</p>

# ZKcheck — Selección de Beca con Pruebas de Conocimiento Cero

> Proyecto desarrollado para la hackatón de **Midnight Network** (track de privacidad / identidad reutilizable).
>
> ⚠️ **Estado: en desarrollo.** El contrato y el flujo completo todavía se están implementando.

## 📌 Descripción

**ZKcheck** es un sistema que permite a una facultad seleccionar y otorgar una beca a un alumno que cumple ciertas condiciones académicas y personales, **sin que el alumno revele sus datos reales** (edad exacta, promedio exacto, identidad, etc.).

Usando pruebas de conocimiento cero (ZK), el alumno puede demostrar que cumple los requisitos de la beca sin exponer la información sensible que hay detrás de esa prueba.

## 🎯 Problema que resuelve

Los procesos tradicionales de asignación de becas requieren que la facultad acceda a datos personales y académicos completos del alumno (edad, promedio, situación particular), lo que:

- Expone información sensible innecesariamente.
- Genera desconfianza sobre el uso posterior de esos datos.
- Dificulta procesos transparentes y auditables sin comprometer la privacidad.

ZKcheck resuelve esto reemplazando la verificación directa de datos por una **prueba criptográfica de cumplimiento de condiciones**.

## ✅ Condiciones de elegibilidad (ejemplo)

Un alumno es elegible para la beca si cumple, entre otras, las siguientes condiciones:

- Ser **mayor de 18 años**.
- Tener un **promedio de materias mayor a 75%**.

El circuito ZK verifica que estas condiciones se cumplen **sin revelar la edad exacta ni el promedio exacto** del alumno.

## 🏗️ Arquitectura (en base al enfoque de [ZKcheck - Votación](#))

El diseño reutiliza el mismo patrón validado en el proyecto hermano de votación universitaria privada:

1. **Emisión de credencial (off-chain):** la facultad emite una credencial firmada al alumno, conteniendo sus datos académicos (edad, promedio, etc.) como *commitment + salt*.
2. **Almacenamiento en wallet:** el alumno guarda la credencial en su wallet (ej. Lace), sin exponerla públicamente.
3. **Prueba ZK (on-chain / circuito):** al postularse a la beca, el alumno genera una prueba que demuestra, usando la credencial como *witness privado*, que:
   - Su edad ≥ 18 años.
   - Su promedio > 75%.
4. **Verificación:** el circuito valida la firma de la facultad y las condiciones, sin acceder a los datos reales ni a la base académica.
5. **Nullifier:** se genera un nullifier para evitar que un mismo alumno se postule más de una vez a la misma beca, manteniendo el anonimato.

```
Facultad (emisor)
      │  credencial firmada (commitment + salt)
      ▼
Wallet del alumno (Lace)
      │  witness privado
      ▼
Circuito ZK (Compact) ── verifica firma + condiciones + nullifier
      │
      ▼
Resultado: elegible / no elegible (sin revelar datos)
```



<p align="center">
  <img src="./assets/verification_flow.png" alt="Diagrama de flujo de verificación: Rules → Eligibility → Verification → Result" width="600" />
</p>
### Flujo de verificación
El flujo simplificado de verificación es:

1. **Rules** — se definen las reglas de elegibilidad (edad ≥ 18, promedio > 75%).
2. **Eligibility** — se evalúan las condiciones contra la credencial del alumno.
3. **Verification** — el circuito ZK valida la prueba generada.
4. **Result** — se emite el resultado: **Authorized** (elegible para la beca) o **Not authorized**, sin exponer los datos subyacentes.

## 🛠️ Stack tecnológico

- **Midnight Network** — blockchain con soporte nativo para privacidad y ZK.
- **Compact** — lenguaje de contratos inteligentes de Midnight.
- **Wallet compatible** (ej. Lace) para almacenamiento de credenciales.

## 🚧 Estado actual

- [x] Definición del caso de uso y condiciones de elegibilidad.
- [x] Diseño de arquitectura basado en el proyecto de votación.
- [ ] Implementación del contrato en Compact.
- [ ] Flujo de emisión de credenciales por parte de la facultad.
- [ ] Integración con wallet.
- [ ] Pruebas end-to-end.

## 🚀 Cómo correr el proyecto

> Sección a completar a medida que avance la implementación.

```bash
# clonar el repositorio
git clone <URL_DEL_REPO>
cd zkcheck-beca

# instalar dependencias
npm install

# compilar el contrato Compact
# (comando específico a agregar cuando el contrato esté listo)
```

## 👥 Autoría

Proyecto desarrollado por Mirta Longhitano para la hackatón de Midnight Network.

## 📄 Licencia

Por definir.
