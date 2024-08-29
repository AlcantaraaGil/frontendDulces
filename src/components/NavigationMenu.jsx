import React from 'react'
import '../App.css'
import { Menu,Layout, Typography } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined, ProductOutlined, SmileOutlined,GithubOutlined,LinkedinOutlined } from '@ant-design/icons';
import { Navigate } from "react-router-dom";
import {Routes,Route,NavLink,BrowserRouter} from 'react-router-dom';
import {Ventas} from '../components/Ventas';
import {Vender} from '../components/Vender';
import {Productos} from '../components/Productos';
import {Clientes} from '../components/Clientes';
import { VentasTotales } from './VentasTotales';
import { ReporteVentas } from './ReporteVentas';
import {ReporteCliente} from './ReporteCliente'
import { ReporteProducto } from './ReporteProducto';

export const NavigationMenu = () => {
  return (
    <BrowserRouter>
    <Layout>
        <nav className="menu-container">
            <Menu theme="dark" mode="horizontal">

                    <Menu.Item key="vender" icon={<ShoppingCartOutlined />}>
                        <NavLink to='/vender'>Vender</NavLink>
                    </Menu.Item>

                    <Menu.Item key="ventas" icon={<ShoppingOutlined />}>
                    <NavLink to='/ventas'>Ventas</NavLink>
                    </Menu.Item>

                    <Menu.Item key="productos" icon={<ProductOutlined />}>
                    <NavLink to='/productos'>Productos</NavLink>
                    </Menu.Item>

                    <Menu.Item key="clientes" icon={<SmileOutlined />}>
                    <NavLink to='/clientes'>Clientes</NavLink>
                    </Menu.Item>

            </Menu>
        </nav>
        <section className="main-container">
            <Routes>
                <Route path='/' element={<Navigate to="/vender"/>} />
                <Route path='/vender' element={<Vender/>} />
                <Route path='/ventas' element={<Ventas/>}>
                    <Route index element={<VentasTotales/>} />
                    <Route path='ventas-totales' element={<VentasTotales/>}/>
                    <Route path='ventas-reporte' element={<ReporteVentas/>}/>
                    <Route path='ventas-cliente' element={<ReporteCliente/>}/>
                    <Route path='ventas-producto' element={<ReporteProducto/>}/>
                </Route>
                <Route path='/productos' element={<Productos/>} />
                <Route path='/clientes' element={<Clientes/>} />
            </Routes>
        </section>
        <Layout.Footer style={{ textAlign: 'center' }}>
            <div className='footer-line'></div>
            <div className='logos'>
                <Typography.Text>&#169; 2024 por Gilberto Alcántara </Typography.Text>
                <a href="https://www.linkedin.com/in/alcantaraagil/" target="_blank" rel="noopener noreferrer">
                <LinkedinOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
                </a>
                <a href="https://github.com/AlcantaraaGil" target="_blank" rel="noopener noreferrer">
                <GithubOutlined style={{ fontSize: '24px' }} />
                </a>
            </div>
        </Layout.Footer>
    </Layout>
    </BrowserRouter>
  )
}
