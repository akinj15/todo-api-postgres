# todo-api-postgres


### dependencias nodejs 

- instalar com  
 $ yarn

- criar arquivo .env na raiz do projeto 
- colocar uma chave de acesso do banco de dados POSTGRES
- nomear a chave como "POSTGRES_URL"


# end points 

- /users
 GET - lista todos os usuarios

- /user/:user_name/:passwd
 GET - lista usuario por user_name e senha 
 
 - /user/:user_id
 GET usuario pelo id
 
- /user
 POST usuario exemplo de body { "user_name" = "" , "passwd" = "", "user_email" = "" }
 
 - /user/:user_id
 PATCH usuario exemplo de body { "user_name" = "" , "passwd" = "", "user_email" = "" }

 - /user/:user_id
 DELETE usuario 
 
 
- /todo/:id_user
 POST todo exemplo de body { "title" = "" , "todo_description" = "", "todo_done " = "" }

- /todo/:id_user
 GET todo pro id_usuario

- /todo/:user_id/:todo_id
 PATCH todo exemplo de body { "title" = "" , "todo_description" = "", "todo_done " = "" }

- /todo/:id_user/id_todo
 DELETE todo por id_user e id_todo 



