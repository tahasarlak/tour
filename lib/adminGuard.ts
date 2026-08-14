import { getAdminSession } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function adminGuard(){


const admin = await getAdminSession();



if(!admin){


return NextResponse.json(
{
error:"Unauthorized"
},
{
status:401
}
);


}



return null;


}