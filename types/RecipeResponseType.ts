
 export type RecipeResult = {
      title: string
       recipe:any,
       ingredients?:Ingredients[],//marked as optional for type compatability
         uri: string,
         label:string,
         image:string,
         imageType:string,
         source: string,
         url: string, //for the source (third party) url
         dietLabels:string[],
         healthLabels: string[],
         ingredientLines: string[]
         isPrivate: boolean;
      link?:string;
 }

 export type Ingredients = {
        text: string,
        quantity: number,
        measure: string,
        food: string,
        weight: number,
        foodCategory: string,
        foodId: string,
        image: string
 }
