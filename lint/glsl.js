export default function glsl(string , params){
    return '#version 300 es\n'+string.join(' ');
}