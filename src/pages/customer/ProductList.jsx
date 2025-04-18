import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import Navbar from '../../components/Customer/Navbar';

const ProductList = () => {
    const context = useContext(MyContext);

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
        return () => {
            context.setisHideSidebarAndHeader(false);
        };
    }, [context]);


    return (
        <>
            <Navbar />
            <div className="main">
                    <div className="row">
                        <div className="col-sm-5">

                        </div>
                        <div className="col-sm-7">

                        </div>
                    </div>

            </div>
        </>
    );
};

export default ProductList;