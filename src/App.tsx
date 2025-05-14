import { Routes, Route } from 'react-router-dom';
import TemplateList from './components/TemplateList';
import TemplateForm from './components/TemplateForm';
import { Toaster } from 'react-hot-toast';
import TemplateSelectionPage from './components/TemplateSelectionPage';
import CustomTemplate from './components/CustomTemplate';
import CustomTemplatesList from './components/CustomTemplateList';


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="bottom-center" reverseOrder={false} toastOptions={{style:{background:'#333',color:'#fff'}}}/>
     <Routes>
      <Route path='/' element={<TemplateSelectionPage/>}/>
      <Route path='/template-list' element={<TemplateList/>}/>
      <Route path='/create' element={<TemplateForm/>}/>
      <Route path='/edit/:id' element={<TemplateForm/>}/>
      <Route path='/custom-template' element={<CustomTemplate/>}/>
      <Route path='/custom-view' element={<CustomTemplatesList/>}/>
     </Routes>
    </div>
  );
}
export default App;