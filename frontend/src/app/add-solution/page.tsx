'use client'
import BlackBtn from '@/components/buttons/BlackBtn'
import Form from '@/components/Form'
import TextInput from '@/components/TextInput'
import { useState } from 'react'

const AddSolutionPage = () => {
    const [softwareName, setSoftwareName] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [description, setDescription] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {

    }

    return (
        <Form title="Add a New Solution" description="Share your favorite software tools and help the community discover new solutions." error={error}>
            <TextInput labelText='Software Name *' inputType="text" placeholder="e.g., Notion, Slack, Figma" onChange={(e) => setSoftwareName(e.target.value)} />
            <TextInput labelText='Category *' inputType="text" placeholder="e.g., Notion, Slack, Figma" onChange={(e) => setCategory(e.target.value)} />
            <TextInput labelText='Company (Optional)' inputType="text" placeholder="Search for existing company or leave blank" onChange={(e) => setCompany(e.target.value)} />
            <TextInput labelText='Website Url' inputType="text" placeholder="e.g., Notion, Slack, Figma" onChange={(e) => setWebsiteUrl(e.target.value)} />
            <TextInput labelText='Description' inputType="textarea" placeholder="e.g., Notion, Slack, Figma" onChange={(e) => setDescription(e.target.value)} />
            <div className='m-2'></div>
            <BlackBtn type="submit" onClick={handleSubmit}>
                Submit Solution
            </BlackBtn>
        </Form>
    )
}

export default AddSolutionPage