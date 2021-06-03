import React from 'react'
import {Col, Row} from "antd";
import EditCourseItem from "./EditCourseItem";
import MainCardEditor from "../../Editor/MainCardEditor/MainCardEditor";

export default function EditCourseByID(){
    return(
        <div className="mt-4 ml-4">
            <div style={{overflowY: "scroll"}} className="ml-5 mr-5">
                <div style={{width: 4000}}>
                    <br/>
                    <Row>
                        <Col>
                            <div style={{width: 2000}}>
                                <Row gutter={[16, 16]}>
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((id) =>{
                                        return(<Col span={2} key={id + "KEY"} >
                                            <EditCourseItem item_id={id}/>
                                        </Col>)
                                    })}
                                </Row>
                            </div>
                        </Col>
                        <Col>
                            <div style={{width: 2000}}>
                                <Row gutter={[16, 16]}>
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((id) =>{
                                        return(<Col span={2} key={id + "KEY"} >
                                            <EditCourseItem item_id={id}/>
                                        </Col>)
                                    })}
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <br/>
                </div>
                <div style={{width: 4000}}>
                    <br/>
                    <Row>
                        <Col>
                            <div style={{width: 2000}}>
                                <Row gutter={[16, 16]}>
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((id) =>{
                                        return(<Col span={2} key={id + "KEY"} >
                                            <EditCourseItem item_id={id}/>
                                        </Col>)
                                    })}
                                </Row>
                            </div>
                        </Col>
                        <Col>
                            <div style={{width: 2000}}>
                                <Row gutter={[16, 16]}>
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((id) =>{
                                        return(<Col span={2} key={id + "KEY"} >
                                            <EditCourseItem item_id={id}/>
                                        </Col>)
                                    })}
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <br/>
                </div>
                <div style={{width: 4000}}>
                    <br/>
                    <Row>
                        <Col>
                            <div style={{width: 2000}}>
                                <Row gutter={[16, 16]}>
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((id) =>{
                                        return(<Col span={2} key={id + "KEY"} >
                                            <EditCourseItem item_id={id}/>
                                        </Col>)
                                    })}
                                </Row>
                            </div>
                        </Col>
                        <Col>
                            <div style={{width: 2000}}>
                                <Row gutter={[16, 16]}>
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((id) =>{
                                        return(<Col span={2} key={id + "KEY"} >
                                            <EditCourseItem item_id={id}/>
                                        </Col>)
                                    })}
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <br/>
                </div>
                <div style={{width: 4000}}>
                    <br/>
                    <Row>
                        <Col>
                            <div style={{width: 2000}}>
                                <Row gutter={[16, 16]}>
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((id) =>{
                                        return(<Col span={2} key={id + "KEY"} >
                                            <EditCourseItem item_id={id}/>
                                        </Col>)
                                    })}
                                </Row>
                            </div>
                        </Col>
                        <Col>
                            <div style={{width: 2000}}>
                                <Row gutter={[16, 16]}>
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((id) =>{
                                        return(<Col span={2} key={id + "KEY"} >
                                            <EditCourseItem item_id={id}/>
                                        </Col>)
                                    })}
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <br/>
                </div>
            </div>
                <MainCardEditor/>
        </div>
    )
}