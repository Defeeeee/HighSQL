"use client";
import { useState } from 'react';
import styles from './page.module.css';
import CodeBlock from '@/components/CodeBlock';
import clsx from 'clsx'; // For conditional class names

const sidebarItems = [
    {
        name: 'Connection',
        items: [
            { name: 'constructor', description: 'Creates a new `Connection` instance to interact with a MySQL database.' },
            { name: 'query', description: 'Executes a raw SQL query with optional parameters.' },
            { name: 'select', description: 'Performs a SELECT query on the specified table.' },
            { name: 'insert', description: 'Inserts a new row into the specified table.' },
            { name: 'update', description: 'Updates rows in the specified table based on the WHERE clause.' },
            { name: 'delete', description: 'Deletes rows from the specified table based on the WHERE clause.' },
            // ... Add descriptions for other methods
        ]
    },
    // Add more classes and their methods here
];

export default function Docs() {
    const [activeSection, setActiveSection] = useState('Connection');
    const [activeMethod, setActiveMethod] = useState('constructor');

    const handleItemClick = (section: string, method: string) => {
        setActiveSection(section);
        setActiveMethod(method);
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <h1 className={styles.sidebarTitle}>HighSQL</h1>
                <nav>
                    <ul>
                        {sidebarItems.map(section => (
                            <li key={section.name}>
                                <button className={clsx(styles.sidebarLink, activeSection === section.name && styles.active)} onClick={() => handleItemClick(section.name, section.items[0].name)}>
                                    {section.name}
                                </button>
                                {activeSection === section.name && (
                                    <ul>
                                        {section.items.map(item => (
                                            <li key={item.name}>
                                                <button className={clsx(styles.sidebarSublink, activeMethod === item.name && styles.active)} onClick={() => handleItemClick(section.name, item.name)}>
                                                    {item.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            <main className={styles.content}>
                {sidebarItems.map(section => (
                    activeSection === section.name && (
                        <section className={styles.section} key={section.name}>
                            {section.items.map(method => (
                                activeMethod === method.name && (
                                    <div key={method.name}>
                                        <h2 className={styles.heading2}>{method.name}()</h2>
                                        <p className={styles.paragraph}>{method.description}</p>
                                        {/* Add more details, code examples, parameters, etc. here */}
                                        {activeMethod === 'constructor' && (
                                            <>
                                                <CodeBlock code={`
                          const connection = new Connection({
                            host: 'your_database_host', 
                            user: 'your_username',
                            password: 'your_password',
                            database: 'your_database_name'
                          });
                        `} language="typescript" />

                                                <h3 className={styles.heading3}>Parameters</h3>
                                                <p className={styles.paragraph}>`config`: <code className={styles.inlineCode}>ConnectionConfig</code> (interface)</p>
                                                <ul className={styles.unorderedList}>
                                                    <li className={styles.listItem}>`host` (string): Hostname of the MySQL server.</li>
                                                    <li className={styles.listItem}>`user` (string): Username for the MySQL connection.</li>
                                                    <li className={styles.listItem}>`password` (string): Password for the MySQL connection.</li>
                                                    <li className={styles.listItem}>`database` (string): Name of the database to connect to.</li>
                                                    <li className={styles.listItem}>`connectionLimit` (number, optional): Maximum number of connections in the pool (default: 10).</li>
                                                    <li className={styles.listItem}>`port` (number, optional): Port number of the MySQL server (default: 3306).</li>
                                                </ul>
                                            </>
                                        )}
                                        {/* ... Add similar documentation for other methods ... */}
                                    </div>
                                )
                            ))}
                        </section>
                    )
                ))}
            </main>
        </div>
    );
}
