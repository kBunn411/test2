import { RecipeResult } from "@/types/RecipeResponseType";
import styles from "@/app/styles.module.css";

const SearchBar = ({ recipes}: { recipes: RecipeResult[]}) => {
	return (
		<div className={styles.recipeCard}>
			{/* <div className={styles.search}>
                    <input
                        onChange={(e) => setIngredients(e.target.value)}
                        className={styles.input}
                        type="text"
                        id="ingredient"
                        placeholder="Enter ingredients (comma-separated)"
                    />
                    <button
                        className={styles.button}
                        onClick={() => submitSearch(ingredients)}>
                        Search
                    </button>
                    <button
                        className={styles.button}
                        onClick={fetchRandomRecipes}>
                        Random
                    </button>

                <div className={styles.dropdown}>
                    {hasSearched && (
                        <>
                            <button onClick={toggleDropdown} className={styles.button}>
                                Diet Type
                            </button>
                            {dropdownVisible && (
                                <div className={styles.dropdownContent}>
                                    {dietLabels.map((label, index) => (
                                        <button
                                            key={index}
                                            style={{ display: 'block' }}
                                            onClick={() => toggleFilter(label)}
                                            className={`${styles.button} ${activeFilters.has(label) ? styles.active : ''}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
                
                
                </div>
            </div> */}
		</div>
	);
};

export default SearchBar;