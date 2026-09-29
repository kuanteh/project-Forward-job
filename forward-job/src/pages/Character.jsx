import { Card, Container, Row, Col, Form } from "react-bootstrap";
import

function Character () {
    return (
        <div className="character-page bg-white">
            <h1 className="text-center text-dark">Experience Forward Colleeg Job</h1>
            <p className="text-center text-muted">Select Your Favourite Charactor</p>

            <Row>
                <div className="col-12">
                    <div className="col-6">
                        
                    </div>
                    <div className="col-6">
                        <Card style={{ width: "100%" }}>
                            <Card.Img variant="top" src="xxx" />
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Button variant="primary">←</Button>
                                <Button variant="primary">→</Button>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Row>
        </div>
    );
}

export default Character