import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    //origin: de dónde se está enviando la petición 
    origin: function (origin, callback) {
        const whitelist = [process.env.FRONTEND_URL];

        if(process.argv[2] === '--api'){
            // Si se está ejecutando el backend como API, se permite cualquier origen
            whitelist.push(undefined)
        }

        if(whitelist.includes(origin)){
            callback(null, true);
        }
        else{
            callback(new Error("Error de CORS"))
        }
    }
}
