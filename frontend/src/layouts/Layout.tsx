import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main>
                <Outlet /> {/* nơi render các page con */}
            </main>
        </div>
    );
}
