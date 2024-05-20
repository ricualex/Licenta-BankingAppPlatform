
import "./HomeCardStyle.css"

function HomeCard(props) {
    return (
        <div className="card">
            <ul>
                <img className="card-image" src={props.cardImage} alt="HomeCard"></img>
                <h2 className="card-title">{props.cardTitle}</h2>
                <p className="card-text">{props.cardText}</p>
            </ul>
        </div>
    );
}
export default HomeCard