Проверка

Создание товара bash curl -i -X POST http://localhost:3000/api/products
-H "Content-Type: application/json"
-d '{"name":"Phone","price":499,"category":"electronics","stock":5}'
bash curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json"
-d '{"name":"T-Shirt","price":25,"category":"clothing"}' curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json"
-d '{"name":"Apple","price":2,"category":"food","description":"Свежие яблоки"}' 2. Список, фильтры, пагинация curl "http://localhost:3000/api/products" curl "http://localhost:3000/api/products?category=electronics" curl "http://localhost:3000/api/products?minPrice=10&maxPrice=100" curl "http://localhost:3000/api/products?page=1&limit=2"

Один товар, обновление, удаление bash curl http://localhost:3000/api/products/1
PUT
curl -X PUT http://localhost:3000/api/products/1 -H "Content-Type: application/json"
-d '{"name":"Phone Pro","price":699,"category":"electronics","stock":3}'

PATCH
curl -X PATCH http://localhost:3000/api/products/1 -H "Content-Type: application/json"
-d '{"price":649}'

DELETE
curl -i -X DELETE http://localhost:3000/api/products/3 4. Загрузка изображения bash curl -X POST http://localhost:3000/api/pro
