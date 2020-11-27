// import {globalVariableArray} from "@/decorator/Variable";
//
// export function RequestParams(type) {
//     return (target, name, index) => {
//         globalVariableArray[index] = type;
//         console.log('parseConf[index]:', type);
//     };
// }
//
// export function Validated(target: any, name: any, descriptor: any){
//     const originalMethod = descriptor.value;
//     descriptor.value = function (...args: any[]) {
//         for (let index = 0; index < globalVariableArray.length; index++) {
//             const type = globalVariableArray[index];
//             console.log(type);
//             switch (type) {
//                 case 'number':
//                     args[index] = Number(args[index]);
//                     break;
//                 case 'string':
//                     args[index] = String(args[index]);
//                     break;
//                 case 'boolean':
//                     args[index] = String(args[index]) === 'true';
//                     break;
//             }
//             return originalMethod.apply(this, args);
//         }
//     };
//     return descriptor;
// }
