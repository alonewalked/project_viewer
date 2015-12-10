
export function render(rawstr,...value){ 
    let str = `
    \r\n${value[0]}\n\t
    ${value[1]} (${value[3]}) 【${value[2]}】
    `;

    return str;    
}