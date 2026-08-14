import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ref, push, onValue, query, orderByChild } from 'firebase/database'
import { database } from '../../lib/firebase'
import { useTranslation } from 'react-i18next'

const GuestbookSection = styled.section`
  padding: 100px 20px;
  background: var(--blue);
  color: var(--white);
  border-top: 3px solid #000;
  border-bottom: 3px solid #000;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 60px 15px;
  }
`

const Container = styled.div`
  max-width: 800px;
  width: 100%;
`

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--yellow);
  text-shadow: 4px 4px 0 #000;
  margin-bottom: 10px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2.2rem;
    text-shadow: 3px 3px 0 #000;
  }
`

const Subtitle = styled.p`
  font-family: var(--font-mono);
  font-size: 1rem;
  text-align: center;
  margin-bottom: 40px;
`

const FormBox = styled.form`
  background: var(--white);
  border: 4px solid #000;
  box-shadow: 8px 8px 0 #000;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    padding: 20px;
    box-shadow: 5px 5px 0 #000;
    border-width: 3px;
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-family: var(--font-display);
  font-weight: 800;
  color: #000;
  text-transform: uppercase;
`

const Input = styled.input`
  width: 100%;
  padding: 15px;
  font-family: var(--font-mono);
  font-size: 1rem;
  border: 3px solid #000;
  background: #f4f4f4;
  outline: none;
  transition: background 0.2s, box-shadow 0.2s;

  &:focus {
    background: var(--white);
    box-shadow: 4px 4px 0 var(--blue);
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 15px;
  font-family: var(--font-mono);
  font-size: 1rem;
  border: 3px solid #000;
  background: #f4f4f4;
  min-height: 120px;
  resize: vertical;
  outline: none;
  transition: background 0.2s, box-shadow 0.2s;

  &:focus {
    background: var(--white);
    box-shadow: 4px 4px 0 var(--blue);
  }
`

const SubmitBtn = styled.button`
  padding: 15px 30px;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #000;
  background: var(--yellow);
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  cursor: pointer;
  align-self: flex-start;
  transition: transform 0.1s, box-shadow 0.1s;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0 #000;
  }

  &:active {
    transform: translate(6px, 6px);
    box-shadow: 0 0 0 #000;
  }
`

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const CommentCard = styled.div`
  background: var(--white);
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  padding: 20px;
  color: #000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(10px);
  }
`

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 2px dashed rgba(0,0,0,0.2);
  padding-bottom: 10px;
`

const CommentName = styled.h4`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.2rem;
  margin: 0;
`

const CommentDate = styled.span`
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: #666;
`

const CommentText = styled.p`
  font-family: var(--font-mono);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
`

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
  flex-wrap: wrap;
`

const PageButton = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.1rem;
  color: #000;
  background: ${props => props.$active ? 'var(--yellow)' : 'var(--white)'};
  border: 3px solid #000;
  box-shadow: ${props => props.$active ? '2px 2px 0 #000' : '4px 4px 0 #000'};
  transform: ${props => props.$active ? 'translate(2px, 2px)' : 'none'};
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;

  &:hover {
    background: var(--yellow);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #000;
  }
`

interface Comment {
  id: string
  name: string
  text: string
  date: string
}

export default function Guestbook() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const commentsPerPage = 5
  
  useEffect(() => {
    const commentsRef = ref(database, 'guestbook')
    // Listen for real-time changes
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        // Convert object to array and filter out spam / XSS payloads
        const loadedComments = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).filter((c: any) => 
          c.name && c.text && 
          typeof c.name === 'string' && typeof c.text === 'string' &&
          c.name.trim().length >= 3 && c.text.trim().length >= 5 &&
          !c.name.includes('<') && !c.name.includes('>') &&
          !c.text.includes('<') && !c.text.includes('>') &&
          c.timestamp && c.timestamp <= Date.now() + 86400000 &&
          !c.name.toLowerCase().includes('fuck-stack')
        )
        // Sort descending by timestamp (newest first)
        loadedComments.sort((a, b) => b.timestamp - a.timestamp)
        setComments(loadedComments)
      } else {
        setComments([])
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const sanitizeInput = (str: string) => {
    // React secara otomatis meng-escape (menetralkan) semua tag HTML
    // Jadi kita tidak perlu menghapusnya. Cukup trim spasi kosong.
    return str.trim();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Anti-spam: Rate limiting (1 menit)
    const lastSubmit = localStorage.getItem('lastCommentTime');
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit) < 60000) {
      alert("Mohon tunggu 1 menit sebelum mengirim komentar lagi.");
      return;
    }

    const cleanName = sanitizeInput(name)
    const cleanText = sanitizeInput(text)
    
    // Validasi ketat sesuai permintaan user: Tolak karakter < dan >
    if (cleanName.includes('<') || cleanName.includes('>') || cleanText.includes('<') || cleanText.includes('>')) {
      alert("Karakter '<' dan '>' tidak diperbolehkan demi keamanan.");
      return;
    }
    
    if (cleanName.length < 3 || cleanText.length < 5) {
      alert("Nama minimal 3 karakter dan pesan minimal 5 karakter.");
      return;
    }

    const newComment = {
      name: cleanName,
      text: cleanText,
      date: new Date().toLocaleDateString('id-ID'),
      timestamp: now
    }

    try {
      const commentsRef = ref(database, 'guestbook')
      // Push to firebase (this will automatically sync back to all clients via onValue)
      await push(commentsRef, newComment)
      
      // Catat waktu pengiriman untuk mencegah spam (Rate Limiting)
      localStorage.setItem('lastCommentTime', now.toString())
      
      // Reset form and go back to first page
      setName('')
      setText('')
      setCurrentPage(1)
    } catch (error) {
      console.error("Error adding comment: ", error)
      alert(t('guestbook.errorMsg'))
    }
  }

  return (
    <GuestbookSection id="guestbook">
      <Container>
        <Title>{t('guestbook.title')}</Title>
        <Subtitle>{t('guestbook.subtitle')}</Subtitle>

        <FormBox onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="gb-name">{t('guestbook.yourName')}</Label>
            <Input 
              id="gb-name" 
              type="text" 
              placeholder={t('guestbook.namePlaceholder')} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="gb-text">{t('guestbook.comment')}</Label>
            <Textarea 
              id="gb-text" 
              placeholder={t('guestbook.commentPlaceholder')} 
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </InputGroup>

          <SubmitBtn type="submit">{t('guestbook.submit')}</SubmitBtn>
        </FormBox>

        <CommentsList>
          {comments
            .slice((currentPage - 1) * commentsPerPage, currentPage * commentsPerPage)
            .map((c) => (
            <CommentCard key={c.id}>
              <CommentHeader>
                <CommentName>{c.name}</CommentName>
                <CommentDate>{c.date}</CommentDate>
              </CommentHeader>
              <CommentText>{c.text}</CommentText>
            </CommentCard>
          ))}
        </CommentsList>

        {comments.length > commentsPerPage && (
          <PaginationWrapper>
            {Array.from({ length: Math.ceil(comments.length / commentsPerPage) }).map((_, index) => (
              <PageButton 
                key={index} 
                $active={currentPage === index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </PageButton>
            ))}
          </PaginationWrapper>
        )}
      </Container>
    </GuestbookSection>
  )
}
