
// export type RecipeResponseType ={
//     offset:number,
//     number:number,
//     results:{
//         id:number,
//         title:string,
//         image:string,
//         imageType:string
//     }[],
//     totalResults:number
// }
 export type RecipeResult = {
 		recipe: any
         uri: string,
         title:string,
         image:string,
         imageType:string,
         source: string,
         url: string,
         dietLabels:string[],
         healthLabels: string[],
         ingredientLines: string[]
 }

 export type ingredients = {
        text: string,
        quantity: number,
        measure: string,
        food: string,
        weight: number,
        foodCategory: string,
        foodId: string,
        image: string
 }
