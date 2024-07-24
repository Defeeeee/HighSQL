import styles from './CodeBlock.module.css';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export default function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
    return (
        <pre className={styles.codeBlock}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
    );
}