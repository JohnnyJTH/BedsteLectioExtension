import React from 'react';
import ReactDOM from 'react-dom/client';
import { HomePage } from './pages/home';
import { ThemeProvider } from 'components/theme-provider';
import { isLocationSupported, toPageKey } from 'utils/page';
import { SiteHeader } from 'components/site-header';
import { CalendarPage } from './pages/calendar';
import { createEnableButton } from './content';
import { AssignmentsPage } from './pages/assignments';
import { LectioPage } from './pages/lectio';
import useLocalState from 'components/useLocalState';

export const SchoolContext = React.createContext<null>(null);

const Main = (props: { page: JSX.Element }) => {
    const [school, setSchool] = useLocalState<{ id: string; name: string } | null>('bedstelectio-school', null);
    return (
        <ThemeProvider>
            <SchoolContext.Provider value={{ school, setSchool }}>
                <SiteHeader />
                <div className="prose dark:prose-invert marker:prose-li:text-black dark:marker:prose-li:text-white max-w-none">
                    {props.page}
                </div>
            </SchoolContext.Provider>
        </ThemeProvider>
    );
};

if (localStorage.getItem('bedstelectio-disabled')) {
    const button = createEnableButton();
    (document.querySelector('#m_mastermenu') ?? document.querySelector('#s_m_mastermenu'))
        ?.querySelector('div')
        ?.appendChild(button);
    console.info('Bedstelectio is disabled');
    console.info('To re-enable, click "Enable BedsteLectio" in the top menubar.');
} else {
    if (isLocationSupported(document.location)) {
        require('./content.css');
        const originalContent = document.cloneNode(true) as Document;

        // Clean up the page
        for (const t of ['style', 'link']) {
            for (const i of Array.from(document.getElementsByTagName(t))) {
                if (i.parentElement && !i.innerHTML.includes('tailwind')) {
                    i.remove();
                }
            }
        }

        document.documentElement.classList.value = '';

        const body = document.createElement('body');
        const app = document.createElement('div');
        app.id = 'bedstelectio-app';
        body.append(app);
        document.body.replaceWith(body);
        const root = ReactDOM.createRoot(app);
        let page: JSX.Element;
        switch (toPageKey(document.location)) {
            case 'lectioroot': {
                location.href = 'https://www.lectio.dk/lectio/login_list.aspx';
                break;
            }
            case 'lectio': {
                page = <LectioPage originalContent={originalContent} />;
                break;
            }
            case 'home': {
                page = <HomePage originalContent={originalContent} />;
                break;
            }
            case 'calendar': {
                page = <CalendarPage originalContent={originalContent} />;
                break;
            }
            case 'assignments': {
                page = <AssignmentsPage originalContent={originalContent} />;
                break;
            }
            default: {
                page = <div>Not found</div>;
                break;
            }
        }

        root.render(<Main page={page} />);
    }
}
