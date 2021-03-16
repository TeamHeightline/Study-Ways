import ReactPlayer from "react-player";
// import * as React from 'react'
import {Comment} from '../OpenCard/CardComments'
// import {ActiveCard} from '../InsteadOfDatabase/ActiveCard'
// import {  Typography, Breadcrumb, Rate  } from 'antd';
// import {LeftOutlined, RightOutlined, DownOutlined, UpOutlined} from '@ant-design/icons';
// import 'antd/dist/antd.css';

import {Alert, Pagination, Row, Col} from "react-bootstrap";
// const { Title } = Typography;



// class OpenCard extends React.Component{
//     render(){
//         return(
//             <>
//                 <Row className="ml-2 mt-4 " >
//                     <Col className="col-12 col-md-8">
//                         <Row>
//                             <div className="display-4 text-left mr-sm-2">{ActiveCard.CardTitle}</div>
//                             {/*<Title level={4} className="ml-2">{ActiveCard.CardID}</Title>*/}
//                         </Row>
//                         {/*<Breadcrumb>*/}
//                         {/*    <Breadcrumb.Item>{ActiveCard.Section}</Breadcrumb.Item>*/}
//                         {/*    <Breadcrumb.Item><a href="">{ActiveCard.Theme}</a></Breadcrumb.Item>*/}
//                         {/*    <Breadcrumb.Item><a href="">{ActiveCard.SubTheme}</a></Breadcrumb.Item>*/}
//                         {/*    <Breadcrumb.Item>{ActiveCard.SubSubTheme}</Breadcrumb.Item>*/}
//                         {/*    <Breadcrumb.Item>{ActiveCard.CardLevel}</Breadcrumb.Item>*/}
//                         {/*</Breadcrumb>*/}
//                     </Col>
//                     <Col   className="mt-3 col-10 col-md-3">
//                         {/*<Pagination size="lg">*/}
//                         {/*    <Pagination.Item><LeftOutlined/></Pagination.Item>*/}
//                         {/*    <Pagination.Item className="secondary"><UpOutlined/></Pagination.Item>*/}
//                         {/*    <Pagination.Item className="secondary"><DownOutlined/></Pagination.Item>*/}
//                         {/*    <Pagination.Item><RightOutlined/></Pagination.Item>*/}
//                         {/*</Pagination>*/}
//                     </Col>
//                 </Row>
//                 <Row className="mt-4">
//                     <Col className="col-12 col-lg-5 ml-2 mt-4">
//                         <ReactPlayer width="auto"  controls
//                                      url={ActiveCard.VideoURL}
//                         />
//                     </Col>
//                     <Col className="col-12 col-lg-6">
//                         <Alert className="blockquote" variant="light" >{ActiveCard.CardText}</Alert>
//
//                         <Alert className="blockquote">На сколько эта карточка была полезна?</Alert>
//                         {/*<Rate allowHalf defaultValue={4} className="ml-3" />*/}
//                     </Col>
//                 </Row>
//                 <Comment/>
//             </>
//         )
//     }
// }
// export {OpenCard}
