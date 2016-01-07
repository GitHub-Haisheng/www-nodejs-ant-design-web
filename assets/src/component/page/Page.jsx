import './style.less';
import React from 'react';
import { Breadcrumb } from 'antd';
import {Link} from 'react-router';
import {menuRouts} from '../MenusRouts'
import Sidebar from '../sidebar/Sidebar';
const Page = React.createClass({
    getInitialState(){
        return {
            pageHeader: ''
        }
    },
    setPageHeader(){
        let pageHeaderJsx = '';
        let pageHeaderDate = null;
        if (this.props.header === 'auto') {
            let currentMenuKey = Sidebar.getCurrentMenuKey();
            let currentMenu = null;
            for (let i = 0; i < menuRouts.length; i++) {
                let menu = menuRouts[i];
                if (menu.key === currentMenuKey) {
                    currentMenu = menu;
                }
            }
            let breadcrumbItems = [];
            for (let i = 0; i < currentMenu.parentText.length; i++) {
                breadcrumbItems.push({text: currentMenu.parentText[i]});
            }
            breadcrumbItems.push({text: currentMenu.text});
            pageHeaderDate = {
                title: currentMenu.text,
                breadcrumbItems
            };
        } else if (this.props.header) {
            pageHeaderDate = this.props.header;
        }
        if (pageHeaderDate) {
            let breadcrumbItems = [
                <Breadcrumb.Item key="page-breadcrumb-item-home"><Link to="/">首页</Link></Breadcrumb.Item>
            ];
            let items = pageHeaderDate.breadcrumbItems;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let key = 'page-breadcrumb-item' + i;
                breadcrumbItems.push(
                    item.path ? <Breadcrumb.Item key={key}><Link to={item.path}>{item.text}</Link></Breadcrumb.Item>
                        : <Breadcrumb.Item key={key}>{item.text}</Breadcrumb.Item>
                );
            }
            pageHeaderJsx =
                <div className="admin-page-header">
                    <h1 className="admin-page-header-title">{pageHeaderDate.title}</h1>
                    <Breadcrumb>
                        {breadcrumbItems}
                    </Breadcrumb>
                </div>;
        }
        this.setState({
            pageHeader: pageHeaderJsx
        });
    },
    componentDidMount(){
        let _this = this;
        /*
        * 由于Routs中使用了一个setInterval，处理页面首次进入时候的菜单状态，导致这里不能确保在菜单设置状态之后访问，所以加了个setTimeout
        * TODO：Routs中的setInterval和这里的setTimeout都是不好的解决方案，需要替换。
        * */
        setTimeout(function(){
            _this.setPageHeader();
        },10);//这种方式，切换页面的时候，头部会闪动，设置成1ms也会有闪动。
    },
    render() {
        return (
            <div className={"admin-page " + this.props.className}>
                <div className="admin-page-loading"></div>
                {this.state.pageHeader}
                <div className="admin-page-content">
                    <div className="admin-page-content-inner">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});

export default Page;
