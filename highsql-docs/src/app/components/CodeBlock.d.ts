declare module '@/components/CodeBlock' {
    interface CodeBlockProps {
        code: string;
        language?: string;
    }

    const CodeBlock: (props: CodeBlockProps) => JSX.Element;
    export default CodeBlock;
}
