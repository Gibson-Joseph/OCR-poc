import { Table } from "./";
import { Header } from "./";

const Layout = () => {
  return (
    <div className="h-screen">
      {/* Header Component */}
      <Header />

      <div className="w-[90%] h-[75%] m-auto mt-5">
        {/* Table Component */}
        <Table />
      </div>
    </div>
  );
};

export default Layout;
