const apiKey = 'c10ca9a605364987997f3cf1cb186c63' //my key

async function searchRecipes() {
  const ingredientInput = document.getElementById('ingredient').value;
  const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientInput}&number=10&apiKey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayRecipes(data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
}

function displayRecipes(recipes) {
  const recipesContainer = document.getElementById('recipes');
  recipesContainer.innerHTML = ''; //clears any previois result

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" />
      <h3>${recipe.title}</h3>
      <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}" target="_blank">View Recipe</a>
    `;

    recipesContainer.appendChild(recipeCard);
  });
}
