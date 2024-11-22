import styles from "./button.module.css";
const Button = ({ text, onClick }: { text: string; onClick: () => any }) => {
    return (
        <button className={styles.button} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
