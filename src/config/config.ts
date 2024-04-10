import { registerAs } from "@nestjs/config";

export enum ConfigKeys {
    App="App",
    Db= "Db",
    Jwt = 'Jwt'
}

const AppConfig = registerAs(ConfigKeys.App,()=>({
    port:3000,

}))

const JwtConfig = registerAs(ConfigKeys.Jwt,()=>({
    refreshToken:'sdfsdfsdf',
    accessToken: 'wefwefsdfsdf'

}))

const DbConfig = registerAs(ConfigKeys.Db,()=>({
    port:5432,
    host:"localhost",
    username:"postgres",
    password:"H@mrah8339!",
    database:"auth"
}))



export const configurations = [AppConfig,DbConfig,JwtConfig]