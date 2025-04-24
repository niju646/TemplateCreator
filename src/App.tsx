import { Routes, Route } from 'react-router-dom';
import TemplateList from './components/TemplateList';
import TemplateForm from './components/TemplateForm';
import { Toaster } from 'react-hot-toast';



function App() {
  return (
    
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
     <Routes>
   
      <Route path='/' element={<TemplateList/>}/>
      <Route path='/create' element={<TemplateForm/>}/>
      <Route path='/edit/:id' element={<TemplateForm/>}/>
      
     </Routes>
    </div>
  );
}

export default App;