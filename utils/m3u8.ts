export async function get_m3u8_content(url:string){
const res= await fetch(url);
const text=await res.text();
return text;
}