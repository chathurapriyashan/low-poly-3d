export default function frag(string , params){
    return '#version 300 es\n'+string.join(' ')
}