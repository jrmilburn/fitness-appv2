import Search from '../../components/Nutrition/Search/Search'

export default async function SearchPage() {

    return (
        <Search 
            addFood={() => console.log('hello')}/>
    )

}