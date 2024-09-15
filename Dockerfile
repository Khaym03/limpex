# Usa una imagen base de Go
FROM golang:1.23.1-alpine AS go-builder

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos go.mod y go.sum
COPY go.mod go.sum ./

# Descarga las dependencias de Go
RUN go mod download

# Copia el resto del código fuente de la aplicación
COPY . .

# Compila la aplicación Go
RUN go build -o bin cmd/api/main.go

EXPOSE 3000

CMD ["./bin/main"]