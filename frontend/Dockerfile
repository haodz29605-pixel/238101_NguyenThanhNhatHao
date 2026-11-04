# Giai đoạn 1: Build ứng dụng React (Vite) - Nâng cấp lên Node 20
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Giai đoạn 2: Sử dụng Nginx để phục vụ file tĩnh
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]