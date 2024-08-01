import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LazyRouter, ProtectedRoute } from "./components";
import { Home, Landing, Register, Error } from "./common";

const Test = LazyRouter(() => import("./pages/Test"));
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route path={"test"} element={<Test />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
