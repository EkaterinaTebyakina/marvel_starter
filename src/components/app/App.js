import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";
//import MainPage from "../pages/MainPage";
//import ComicsPage from "../pages/ComicsPage";
//import {MainPage, ComicsPage, Page404, SingleComicPage} from '../pages'

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'))
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));

const App = () => {    
    
        return (
            <Router>
                <div className="app">
                    <AppHeader/>
                    <main>
                        <Suspense fallback={<Spinner/>}>
                            <Routes>
                                <Route path='/' element={<MainPage/>}/>
                                <Route path='/comics' element={<ComicsPage/>}/>
                                <Route path='/comics/:comicId' element={<SingleComicPage/>}/>
                                <Route path='*' element={<Page404/>}/>
                                {/* <Route exact path='/comics'>
                                    <ComicsPage/>
                                </Route> */}
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </Router>
            
        )
}

export default App;