import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-blue-500 flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl text-white mb-6">Oops!</h1>
        <p className="text-white text-2xl">
          We seem to have encountered some problems.
        </p>
        <p className="text-white text-lg mt-2">
          Please try again later, or contact our support team.
        </p>
        <Button className="btn btn-primary mt-6" onClick={() => navigate("/")}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default Error;
